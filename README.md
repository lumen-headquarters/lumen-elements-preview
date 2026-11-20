# Lumen Elements Preview

The browser gallery for [Lumen Elements](https://github.com/lumen-headquarters/lumen-elements).
It runs from the parent repository's `preview/` submodule and loads the catalog from the parent checkout.

```sh
git clone --recurse-submodules https://github.com/lumen-headquarters/lumen-elements.git
cd lumen-elements
bun install --frozen-lockfile
bun run dev
```

Open [localhost:4178](http://localhost:4178) to try the gallery. Send catalog changes to
Lumen Elements and gallery changes here.

The preview code is licensed under [Apache 2.0](LICENSE). The bundled typefaces have
their own [licenses](fonts).
