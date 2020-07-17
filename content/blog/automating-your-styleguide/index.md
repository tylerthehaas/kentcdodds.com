---
slug: automating-your-style-guide
date: 2020-05-16
title: 'Automating Your Style Guide'
author: 'Tyler Haas'
description:
  '_How to ensure your team is following best practices without arguing over
  it._'
categories:
  - 'javascript'
  - 'automation'
keywords:
  - 'code quality'
  - 'javascript'
  - 'style guide'
  - 'automation'
banner: './images/banner.jpg'
bannerCredit: 'Photo by [Obi Onyeador](https://unsplash.com/photos/-4NNL4-E4q8)'
---

# Becoming Productive in New Projects

> In any large organization there is often a desire to be able to move engineers
> between teams and projects. Having a consistent coding style will often make
> that easier.
>
> [Ryan Hansen](https://dev.to/ketiko/enforcing-java-coding-styles-1a9)

One main reason this is true is because joining a new project is largely an
orientation exercise. For the first little while you will spend most of your
time discovering the patterns and practices that the other developers who have
worked on this project have used. The other part of your day will be spent
learning how things are organized. For this reason it is fairly rare to come to
a new project and be immediately productive.

Everyone has a certain rate they learn things at. This makes it so that time to
productivity follows a simple formula:

> amount to learn / average rate of learning = time to productivity

So if we want to move developers between projects at a company while maintaining
the highest level of productivity possible there are only two ways to do this.

1. Increase team members learning rate
2. decrease the amount needed to learn to be productive

It turns out increasing learning rate is incredibly difficult to do. So the
question becomes how can we decrease the amount a developer needs to learn to be
productive?

One way to do this is to setup systems that allow as many things to stay
consistent as possible across projects. These systems are called style guides.

# Enforcing Style Guides

Assuming you have a style guide in place it is a herculian task getting a whole
organization to follow it. The issue isn't getting everyone bought into the idea
of a style guide (though that can also sometimes be a problem). Its the amount
of information encoded into a style guide is hard for developers to keep in
their heads when they are coding and reviewing code. Between the convention for
file location, code formatting and a myriad of other best practices it's easy to
forget all the things to watch out for. And naturally things will be forgotten
and quickly projects have inconsistencies which increases the cognitive load for
new developers.

The only real way to avoid this cycle is to enforce this through automation.
Fortunately there are a lot of tools that help us to enforce style guides in an
automated way. The primary way this is done is through git hooks, a code
formatter, linter and typechecker. I most commonly use pre-commit and pre-push
hooks with [Husky](https://github.com/typicode/husky).

Using Husky I can setup my linter([eslint](https://github.com/eslint/eslint))
and code formatter([prettier](https://github.com/prettier/prettier)) to make
sure that agreed upon coding practices and formats are always used before each
commit. To set that up I would add the following to my package.json.

```json
{
  "scripts": {
    "prettier": "prettier --write .",
    "lint": "eslint --max-warnings 0"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run prettier"
    }
  }
}
```

This makes it so that you are unable to commit without first conforming to our
agreed upon style guide, ensuring that all projects with this setup are
consistent.

# Tradeoffs

Having this setup is great because it keeps all projects consistent allowing the
amount a developer needs to get used to on different projects minimal. But the
way we've set it up is inefficient. Everytime we change a file we will run
eslint and prettier on all files in the project. This takes time and assuming
that we have already run this on files in our project we are probably doing a
lot of unnecessary work. This wont scale well to larger projects. It'd be nice
if we could only run this on files that have actually changed.
[lint-staged](https://github.com/okonet/lint-staged) does this for us.

If we make the following change to our package.json

```json
{
  "scripts": {
    "prettier": "prettier --write .",
    "lint": "eslint --max-warnings 0"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["yarn lint", "yarn prettier"]
  }
}
```

we will have the same checks done for us but only on files that git has detected
have changed and are staged for commit. This greatly reduces the time it takes
to run these checks and allows us to scale the automation of our style guide to
as large of a project as you can imagine.

# Conclusion

Style guides are a great tool for large organizations that want to bring
consistency between projects. But in order for them to work they must be
followed. The only scalable way to achieve this is through automation. Using the
setup I've outlined makes setting this up in all projects super straight
forward. Hope this was helpful!
