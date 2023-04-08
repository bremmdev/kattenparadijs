# Kattenparadijs

A cat image gallery built with Next.js, TypeScript, TailwindCSS and Sanity.io.

## Tech

- Next.js
- TypeScript
- TailwindCSS for styling
- Sanity.io as CMS
- Vercel for deployment

## Description

This project is inspired by my love of cats. The project contains an image gallery of my own cats. It also has a dynamic route to give each of the cats its own personal page. For rendering it uses Next.js SSG (Static Site Generation) to optimize loading times. To allow updates to the statically generated pages I also use on-demand ISR (Incremental Static Regeneration). Adding, removing or changing a picture in Sanity CMS will trigger a revalidation of the affected pages, so the pages will be build again with the fresh data. The combination of SSG and ISR allows me to optimize loading times by statically generating the pages but also allows updates to the content when the application is live. 

## Screenshots

![kattenparadijs](https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png)
