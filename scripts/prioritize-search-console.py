#!/usr/bin/env python3
"""Rank real Search Console Pages CSV records, without invented demand or CTR targets.
Usage: python scripts/prioritize-search-console.py performance-data/pages.csv
Export Performance > Pages with English column headers; filter country/device in GSC first.
Output is JSON on stdout. Do not commit private performance exports.
"""
import csv, json, sys
from urllib.parse import urlsplit

def prioritize(rows):
    results = []
    seen = set()
    for row in rows:
        url = row.get('Top pages', row.get('Page', '')).strip()
        parsed = urlsplit(url)
        if parsed.scheme != 'https' or parsed.netloc != 'www.lusaill.online':
            raise ValueError('Export includes a URL outside the official property')
        if url in seen:
            raise ValueError('Duplicate page row; use one Pages export for one period')
        seen.add(url)
        clicks = int(row['Clicks'].replace(',', ''))
        impressions = int(row['Impressions'].replace(',', ''))
        position = float(row['Position'].replace(',', ''))
        if min(clicks, impressions) < 0 or clicks > impressions or position < 1:
            raise ValueError('Invalid performance values')
        if impressions == 0:
            action = 'افحص الفهرسة ونية البحث؛ انعدام الظهور ليس دليلًا على عدم الفهرسة'
        elif position <= 3:
            action = 'راجع استعلامات الصفحة وCTR بحسب البلد والجهاز قبل تغيير العنوان'
        elif position <= 20:
            action = 'فرصة مراجعة: طابق الاستعلامات بالمحتوى والقيمة المضافة والروابط السياقية'
        else:
            action = 'راجع نية البحث والمنافسة والتميّز؛ متوسط الموضع لا يصف كل استعلام'
        results.append({'url': url, 'clicks': clicks, 'impressions': impressions,
                        'ctr': clicks / impressions if impressions else 0,
                        'position': position, 'action': action})
    results.sort(key=lambda r: (not (3 < r['position'] <= 20 and r['impressions'] > 0), -r['impressions']))
    return results

if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    with open(sys.argv[1], encoding='utf-8-sig', newline='') as source:
        result = prioritize(csv.DictReader(source))
    print(json.dumps({'pages': len(result), 'priority_pages': result[:20],
                      'note': 'بيانات الفترة المصدرة فقط. هذه أولويات مراجعة وليست توقعات زيارات أو حكمًا بالفهرسة.'}, ensure_ascii=False, indent=2))
