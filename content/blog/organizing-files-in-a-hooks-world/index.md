---
slug: organizing-files-in-a-hooks-world
date: 2021-01-08
title: 'Organizing Files in a Hooks World'
author: 'Tyler Haas'
description: '_How I prefer to organize my react projects and why._'
categories:
  - 'javascript'
  - 'react'
keywords:
  - 'code quality'
  - 'javascript'
  - 'style guide'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Jeremy Bishop](https://unsplash.com/photos/EwKXn5CapA4)'
---

# Overview

In every project you have to decide how you want to organize your code. This is
important to enable developers to easily navigate the project and quickly orient
themselves within a codebase. A large portion of code organization is simply
what files go where. I'd like to take a few minutes to discuss my preferences
around file location and directory structure and why I have these opinions.

# Directory structure strategies

In the [React Docs](https://reactjs.org/docs/faq-structure.html) it talks about
two different ways of organizing your files.
[Grouping by features or routes](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)
and
[Grouping by file type](https://reactjs.org/docs/faq-structure.html#grouping-by-file-type).

## Grouping by features or routes

Here is an example of how this method looks (Taken straight from the react
docs):

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

The advantage of this approach is that it mirrors conceptually what a user is
trying to accomplish within the app more directly. This is useful since as
you're adding or changing code its easy to conceptualize the mapping of where
code should "live" to the user interaction you want to add/change/fix.

The downside of this approach is that it can involve more maintenance than other
strategies. Imagine that you have a Profile directory for the Profile route and
you get a requirement asking you to make the profile route part of the feed. How
would our code organization above need to change?

1. Move the files under feed Step
2. Update all imports relative to the files that were moved.

While this doesn't seem like a big deal as your project grows this can become
time intensive and cause your teams velocity to slow down.

## Grouping by file type

Here is how this example looks (again taken from the react docs):

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

The advantage of this approach is that it is more flexible to change so as you
receive requirements that would normally cause changes to where files are
located because there is literally no mapping of components to where they live
in the application you dont have to change anything about file location! 🥳

The disadvantage is just the other the coin. There is no mapping so it takes
more grepping to figure out what is used where and it takes longer to get to
know the code base because there is no explicit mapping of what part of the app
each component controls in the directory structure.

# How hooks changes this

In react applications there are 3 main concerns that I have found make sense as
their own modules.

1. What html is rendered (Components)
2. Making API calls
3. Client side logic

## Making API Calls

Lets take a look at Making API Calls. This concern is designed to be more global
and sharable. These modules you are thinking about how to design your module so
that it exposes a nice API for your consumers the components. I have called
these `services` files and they typically expose functions for working with REST
and GraphQL api's.

## Client side logic

Client side logic is also designed to be more global and shareable. When React
came up with the concept of hooks they were trying to solve the problem of "How
do we share logic around manipulating data that doesn't necessarily involve how
html is rendered?" This points us to this being at least somewhat global
conceptually.

## Components

Components are what tie all these pieces together. Components are ultimately
responsible for calling services and hooks where they are needed and using their
data to render the html.

# My Preferences

My preferences are as follows:

```
common/
  __test__/
    api-utils.test.ts
  api-utils.ts
services/
  user.ts
  profile.ts
hooks/
  user.ts
  profile.ts
feed-story/
  __test__/
    feed-story.test.tsx
  feed-story.tsx
  feed.tsx
  feed.css
  avatar.tsx
  avatar.css
profile/
  profile-header.tsx
  profile-header.css
  profile.tsx
```

# How this helps

In this example `feed-story` and `profile` are the two activities conceptually
that a user would perform within the application. Having this mapping exist
helps us more quickly navigate the project. However by making the mapping go
from the route to the job the user is hoping to accomplish decouples it from
routing or view location making it more impervious to changes thus less
maintenance.

One other thing that I've done is that `services` and `hooks` are at the root of
the project as conceptually they are global things that should be shareable and
putting them there indicates that they can and should be used in any other
component. This also helps as you break logic out of existing components to be
able to put them in one central place which makes them easier to find when you
are wondering if a custom hook has already been written to help you out in your
next component.

services are nice to have at the top level because in most cases they'll be used
inside your custom hooks and having them close by helps keep your imports clean
and easier to see what services are and are not available for you to use.

Hope this helps you in your projects. I'd love to hear any feedback you might
have on this!
