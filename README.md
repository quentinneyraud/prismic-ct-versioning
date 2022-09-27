# Prismic Custom Types Versioning

> CLI commands to save and restore Prismic custom types
> [Video](https://twitter.com/quentin_neyraud/status/1407000398699827200)


## Installation 

```bash
npm install -g prismic-ct-versioning
```



## Requirements

### Prismic Custom Types API access

Go to your repository settings (`https://your-repository.prismic.io/settings/apps/`) and check if you have access to the `Custom Types API` tab.  
If not, request feature activation here [https://community.prismic.io/t/feature-activations-graphql-integration-fields-etc/847]().

### Generate an API token

As described here [https://prismic.io/docs/technologies/custom-types-api#permanent-token-recommended](), generate a new token.

### Create a .env file

Create a .env file in your working directory with token and repository ID (you can also pass them from command arguments)

```
PRISMIC_TOKEN=your-api-token
PRISMIC_REPOSITORY=your-repository-id
```


## Usage

`pctv [command] [--exclude-disabled --ed | --output --o | --token --t | --repository --r]`

## Commands

### Pull

Get all Prismic custom types from your repository and save them in `output` directory.

### Push

Get all Prismic custom types from your repository, compare them to your local custom types files and :

- If it exists in your Prismic repository and not in your local files: Delete it from your Prismic repository
- If it doesn't exists in your Prismic repository but in your local files: Add it to your Prismic repository
- If it exists in your Prismic repository and in your local files: Update it in your Prismic repository if `json` schema or `status` state differs


## Arguments

### --exclude-disabled (alias: --ed)

Exclude disabled custom types from `pull` command.

### --output (alias: --o)

Directory where your Prismic custom types are saved (relative to current directory).

### --token (alias: --t)

Prismic Custom Types API token (Override .env PRISMIC_TOKEN variable).

### --repository (alias: --r)

Prismic repository ID (Override .env PRISMIC_REPOSITORY variable).



## TODOS

- [ ] Error handling
- [ ] Warning if content exists that is related to a custom type that will be updated/deleted 
