import {mkdir,copyFile,cp,rm,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','app.js','interactions.js','styles.css','store.js','lib.js','meals.js','import.js','config.js','sw.js','manifest.webmanifest'])await copyFile(file,'dist/'+file);
await cp('assets','dist/assets',{recursive:true});
await writeFile('dist/version.json',JSON.stringify({commit:process.env.GITHUB_SHA||'local'}));
console.log('Built public app in dist/');
