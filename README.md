# nyc.pmtiles

## extract

```
$d = (get-date).ToString("yyyyMMdd")
pmtiles.exe extract https://build.protomaps.com/$d.pmtiles public/nyc.pmtiles --region .\nyc.geojson
```
