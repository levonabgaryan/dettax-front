# DettaxFront

A small Angular project for a recipe website.  
The project uses some ideas from hexagonal architecture and Domain-Driven Design (DDD).  
The goal is to make the front end easier to maintain and read.  
Please note that some links might not be implemented yet.

Data comes from [TheMealDB](https://www.themealdb.com/).  
TheMealDB API is not always easy to use or well-structured.  
So in some parts of the code, the data is transformed in order to fit our domain.

## Requirements

Before you start, make sure you have:

- **Node.js**: `22.12.0` or higher (LTS version is recommended)
- **npm**: `12.0.2`  
  You can install it with: `npm install -g npm@12.0.2`  
  Or use Corepack: `corepack enable`
- **Angular CLI**: You can install it globally with `npm install -g @angular/cli`

You can check them with:

```bash
node -v
npm -v
ng version
```

If you do not have Angular CLI, install it:

```bash
npm install -g @angular/cli
```

## How to run the project locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
ng serve
```

3. Open your browser and go to:

```text
http://localhost:4200/
```

If port `4200` is busy, you can use another port:

```bash
ng serve --port 4300
```
