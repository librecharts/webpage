<p align="center"><img src="https://raw.githubusercontent.com/librecharts/branding/main/raster/logo_transparent.png" alt="project-image" style="width: 150px"></p>
<h1 align="center" id="title">LibreCharts Webpage</h1>
<p align="center">
    <a href="#setting-up-for-development">Developing</a>
     • 
    <a href="#contribution-guidelines">Contributing</a>
     • 
    <a href="#production">Production</a>

</p>


## Contributing

### Setting up for development

You can set up the webpage for development as follows.


```
npm i
npm run dev
```

If you're using a local API ensure you change `base_url` in `src/api.ts` to your local API url.

### Contribution guidelines

You may view the contrubition guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

If you wish to contribute charts please see the [charts repository](https://github.com/librecharts/charts).


## Production

When running for production follow the steps outlined in the [Vue.js documentation](https://vuejs.org/guide/best-practices/production-deployment.html).

Summarized: 

```
npm run build
```

This will output a static website to the `/dst` folder.