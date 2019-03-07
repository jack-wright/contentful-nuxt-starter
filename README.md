# nuxt-starter
A Nuxt.js based starter site that uses Contentful as a headless CMS and is suitable for small-medium sized projects

# To get started

**DO NOT USE NPM FOR THIS PROJECT, IT'S A YARN PROJECT**

1.
```
yarn install
```

2. make a copy of `.env.example`
```
cp .env.example .env
```

3. add the project specific details to the `.env` file
```
vim .env
```

4. Make a copy of the `env.example.json` file
```
cp env.example.json env.json
```

5. add the contentful env properties to the `env.json` file
```
vim env.json
```

6. also make sure you update the values in `config.js`
```
vim config.js
```

Take particular care to update the gtm (Google Tag Manager) key or remove it.

# Contentful

## Setting up a Contentful space

In order to import the content models that pair with this starter template, you need to have a Contentful space that you can import the data in to.

Because of Contentful's pricing plan, we only get 2 spaces for free, so each customer will have their own Contentful account set up, but when working locally, it is recommended that you create your own personal account and work within there. (Exporting the final data is straightforward and is covered a little further down).

When your account has been created, it will prompt you to set up an example project, you can skip this step as it is not needed. You then need to click the menu button, next to the Contentful logo in the top left corner.

1. Click **Add space**

2. Choose the free version

3. Name the space you are creating and select **Create an empty space**

4. Then hit confirm.

Your space has now been created and you can now import content in to it.

## Importing data in to your Contentful space

### Installing the Contentful CLI tool

To get started we need to globally install the Contentful CLI tool.

```
yarn global add contentful-cli
```

### Login to Contentful via the CLI
Once this has been installed, we need to login to our contentful account.

```
contentful login
```

This will prompt you to open a browser, once open, login and then allow the CLI to have access to your account.

Once authorised, a token will appear on screen, copy this and then paste in to the prompt in your terminal.

You are now logged in and connected to your Contentful account.

### Select the space you are working within

The first thing we want to do when we have logged in, is to make sure we are working within the correct space.

```
contentful space use
```

This will give you a table of the spaces available to you, navigate to the one you want to use and then hit enter. Now anything you do, unless a new space id is specified as an option, will occur within this space.

### Importing the Content Models and Entries

In the Nuxt starter project there is a nuxt-imports directory which contains all of the files we need to fill your Contentful space. Make sure you are in the root directory of the project and then run the following command:

```
yarn contentfulImport
```

This will execute a small bash script that runs through the `nuxt-imports` directory and imports each file within.

Once this has been completed, go to your Contentful space dashboard, and you will now see all of the models and entries that have been imported.

# Setting up a local server
```
yarn watch
```
This will build your project as well as spin up a local server to work on

# Config

## Dynamic Feed Templates

Feeds are configred in `config.js`. An example feed might look like this:

```
  feeds: [
    {
      // required: contentful contentType
      contentType: 'blog',

      // optional: default = 10
      postsPerPage: 20,

      // optional
      parent: {
          // required if parent is provided - the parent ref to fetch pageData from the store
          ref: 'news',
          // required if parent is provided - the parent page id to query from contentful to populate the store
          id: '2nwmrQwdJOq46sYAQOEWug',
      },

      // optional: default = '-sys.createdAt'
      orderBy: '-fields.assignedPublishedDate',

      // optional: default = 'c-post-preview-default.vue'
      previewComponent: 'c-post-preview-blog',

      // optional: default = 'c-post-detail-default.vue'
      detailComponent: 'c-post-detail-blog',

      // optional: accepts 'contact' or 'eventRegistration': default = false
      form: 'contact',

      // optional: array of taxonomies to be fetched from contentful to act as feed post filters
      taxonomies: [
        {
          // client legible name used to title the taxonomy-nav
          name: 'Categories',
          // contentful reference slug
          contentType: 'category',
        },
      ],
    },
  ]
```

The `parent` object is used to fetch and store page metadata to provide a title, content and hero image for the feed page. It is however, not required. If defined it requires both the `ref` and `id` to be defined.

You can create custom component templates inside the `/components/feed/custom/` folder and configure your feed to use them instead. If preview and detail components are not specified the default templates are used.

You can visit your feed at `/feed/<feed.contentType>/`

Visit a feed's paged posts at `/feed/<feed.contentType>/?page=<number>`

Visit a feed's taxonomy posts at `/feed/<feed.contentType>/?<taxonomy.contentType>=<taxonomy.value>`

And post detail pages at `/feed/<feed.contentType>/detail/<post.slug>`

### Optional Vue components

# Print page
Adds a print link to allow the user to print the page.

- Import the component: `import Print from '@/components/UI/print'`
- Register the component in your page template.
- Template syntax: `<print title="Print this page" />`
