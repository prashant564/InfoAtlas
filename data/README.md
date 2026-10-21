# Countries dataset

InfoAtlas owns its country data instead of depending on a third-party API.

- `countries.json` is bundled into every build and is also published, so
  installed apps can update without a store release.
- `manifest.json` is the small file apps check on launch:
  `{version, updatedAt, count}`.

Both are served by jsDelivr from the `main` branch:
`https://cdn.jsdelivr.net/gh/prashant564/InfoAtlas@main/data/`

## How the app uses it

1. On launch the app shows the newest local copy straight away: a cached
   download if it is newer than the bundled file, otherwise the bundled file.
2. In the background it fetches `manifest.json`. If `version` is higher than
   what it has, it downloads `countries.json`, validates it, and caches it.
3. Any failure (offline, timeout, bad JSON) is ignored and local data stays.

## Publishing an update

1. Edit `countries.json` (keep the existing country schema).
2. Run `yarn data:release` to validate it and bump the version in both files.
3. Merge to `main`.

jsDelivr caches branch files for up to 12 hours. To roll out immediately,
purge both files:

```sh
curl https://purge.jsdelivr.net/gh/prashant564/InfoAtlas@main/data/manifest.json
curl https://purge.jsdelivr.net/gh/prashant564/InfoAtlas@main/data/countries.json
```

## World map

The My World map (`src/components/WorldMap/worldMap.json`) is generated
from Natural Earth shapes, matched to `countries.json` by `ccn3`. If you
add or remove a country, regenerate it and commit the result:

```sh
yarn map:generate
```

Countries without a shape (tiny islands) are drawn as dots at their
`latlng`. `__tests__/components/worldMapData.test.ts` fails if a country
in the bundled dataset can't be found on the map.
