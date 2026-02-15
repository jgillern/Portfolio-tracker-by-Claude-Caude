#!/usr/bin/env python3
"""
Extract instrument data from FinanceDatabase for local search.
Source: https://github.com/JerBouma/FinanceDatabase

Run manually or via GitHub Action (monthly schedule).
Output: src/data/{indices,equities,etfs,cryptos}.json
"""

import financedatabase as fd
import json
import os

OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
os.makedirs(OUTDIR, exist_ok=True)


def export_category(name, cls, extra_fields=None):
    obj = cls()
    df = obj.select()
    data = []
    type_map = {
        'indices': 'index',
        'equities': 'equity',
        'etfs': 'etf',
        'cryptos': 'crypto',
    }
    t = type_map.get(name, name)

    for symbol, row in df.iterrows():
        n = row.get('name', '')
        if not n or not symbol:
            continue
        entry = {
            's': str(symbol),
            'n': str(n),
            'e': str(row.get('exchange', '')),
            't': t,
        }
        if extra_fields:
            for field, key in extra_fields.items():
                val = row.get(field)
                if val and str(val) != 'nan':
                    entry[key] = str(val)
        data.append(entry)

    path = os.path.join(OUTDIR, f'{name}.json')
    with open(path, 'w') as f:
        json.dump(data, f, separators=(',', ':'))

    size_kb = os.path.getsize(path) / 1024
    print(f'{name}.json: {len(data)} entries, {size_kb:.0f} KB')
    return len(data)


total = 0
total += export_category('indices', fd.Indices)
total += export_category('equities', fd.Equities, extra_fields={'sector': 'sec'})
total += export_category('etfs', fd.ETFs)
total += export_category('cryptos', fd.Cryptos)

print(f'\nTotal: {total} instruments exported')
