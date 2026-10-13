"""Independent frequency-block calculation cross-checking face-index enumeration."""
import collections
import fractions
import hashlib
import json
import pathlib
import sys

base = pathlib.Path(__file__).parent
config = json.loads((base / 'configuration.json').read_text())
enumeration = json.loads((base / 'enumeration.json').read_text())
frequencies = {d['id']: collections.Counter(d['faces']) for d in config['dice']}
rows = []
for first, counts in frequencies.items():
    for second, others in frequencies.items():
        if first == second:
            continue
        blocks = [{'firstValue': x, 'secondValue': y, 'multiplicity': nx * ny,
                   'result': 'win' if x > y else 'loss' if x < y else 'tie'}
                  for x, nx in sorted(counts.items()) for y, ny in sorted(others.items())]
        totals = {kind: sum(b['multiplicity'] for b in blocks if b['result'] == kind)
                  for kind in ('win', 'loss', 'tie')}
        assert sum(totals.values()) == 36
        prior = next(r for r in enumeration['orderedComparisons']
                     if r['first'] == first and r['second'] == second)
        assert (prior['wins'], prior['losses'], prior['ties']) == (
            totals['win'], totals['loss'], totals['tie'])
        probability = fractions.Fraction(totals['win'], 36)
        assert prior['probability'] == f'{probability.numerator}/{probability.denominator}'
        rows.append({'first': first, 'second': second, 'blocks': blocks,
                     'totals': totals, 'probability': str(probability)})

# Independent disjoint-case proofs for the two mixed/mixed cycle edges.
assert fractions.Fraction(3, 6) + fractions.Fraction(3, 6) * fractions.Fraction(2, 6) == fractions.Fraction(2, 3)
assert fractions.Fraction(2, 6) + fractions.Fraction(4, 6) * fractions.Fraction(3, 6) == fractions.Fraction(2, 3)
assert not any(r['totals']['tie'] for r in rows)

def ref(path):
    return {'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

output = {'passed': True, 'configuration': ref(base / 'configuration.json'),
          'enumeration': ref(base / 'enumeration.json'), 'implementation': ref(base / 'cross-check.py'),
          'method': 'Aggregate identical values into frequency blocks and use exact rational arithmetic; compare every ordered result with independent TypeScript face-index enumeration. Not randomized simulation or physical testing.',
          'orderedComparisons': rows,
          'mixedCaseProofs': {'greenOverBlue': '1/2 + (1/2 × 1/3) = 2/3',
                             'orangeOverGreen': '1/3 + (2/3 × 1/2) = 2/3'},
          'faceProbability': '1/6', 'pairProbability': '1/36',
          'conditions': config['rules']}
path = base / 'cross-check.json'
if '--verify' in sys.argv:
    assert json.loads(path.read_text()) == output
else:
    with path.open('x') as stream:
        json.dump(output, stream, indent=2)
        stream.write('\n')
print(json.dumps({'passed': True, 'allOrderedComparisonsAgreed': len(rows),
                  'bothMixedCaseProofsPassed': True}))
