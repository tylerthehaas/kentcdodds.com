---
slug: 'limiting-states'
title: 'Limiting States'
date: '2020-05-29'
author: 'Tyler Haas'
description: '_How to limit states through data modeling._'
categories:
  - 'react'
  - 'state management'
  - 'reactjs'
  - 'programming'
  - 'typescript'
keywords:
  - 'react'
  - 'reactjs'
  - 'typescript'
  - 'programming'
  - 'coding'
  - 'state management'
published: true
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Hans-Peter Gauster](https://unsplash.com/photos/3y1zF4hIPCg)'
redirects:
  - '/blog/limiting-states'
  - '/blog/limiting-states/'
---

# Limiting State

State management is hard. This major reason for this is the effects of
[combinitorial explosion](https://en.wikipedia.org/wiki/Combinatorial_explosion).
In this article I want explore how we can limit the effects of combinitorial
explosion thus making state easier to manage and our apps simpler.

## Modeling State

Most developers spend little time thinking about the possible ways to model
their state. Whatever gets the job done is fine. Right? Lets look at some ways
we could model our state. Lets say we have a toggle component. One
implementation might look like this:

```typescript
function Toggle() {
  const [on, setOn] = React.useState<boolean>(false)
  return (
    <label aria-label="Toggle">
      <input type="checkbox" checked={on} onClick={() => setOn(on => !on)} />
    </label>
  )
}
```

This is a pretty simple component that a boolean as state probably works fine
for. But lets suppose our product manager comes to us and says "We only want the
user to be able to toggle when they are logged in". Now our component would look
something like:

```typescript
interface ToggleProps {
  isLoggedIn: boolean
}

function Toggle({isLoggedIn}) {
  const [on, setOn] = React.useState<boolean>(false)

  function toggleIfLoggedIn() {
    if (isLoggedIn) {
      setOn(on => !on)
    }
  }

  return (
    <label aria-label="Toggle">
      <input type="checkbox" checked={on} onClick={toggleIfLoggedIn} />
    </label>
  )
}
```

Now we have two pieces of state (props are just passed in state). So the total
possible states we can be in is now 4.

| **count** | **isLoggedIn** | **on** |
| :-------- | :------------: | -----: |
| 1         |     false      |  false |
| 2         |     false      |   true |
| 3         |      true      |  false |
| 4         |      true      |   true |

Now lets say that our product manager comes back to us and says: "You know what
lets save whether our toggle is on or off to the database". So we make that
change.

```typescript
interface ToggleProps {
  isLoggedIn: boolean
}

function Toggle({isLoggedIn}) {
  const [on, setOn] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>(null)
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  React.useEffect(() => {
    setLoading(true)
    fetch('apiResource')
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        setOn(data.on)
      })
      .catch(errorResponse => {
        setLoading(false)
        setHasError(true)
        setError(errorResponse)
      })
  }, [])

  function toggleIfLoggedIn() {
    if (isLoggedIn) {
      setOn(on => !on)
    }
  }

  if (isLoading) return <span>Loading...</span>

  if (hasError) return <span>{error}</span>

  return (
    <label aria-label="Toggle">
      <input type="checkbox" checked={on} onClick={toggleIfLoggedIn} />
    </label>
  )
}
```

now we're getting the explosion of states we were talking about. Here is the
total set of possible states now:

| **count** | **isLoggedIn** | **on** | **error** | **isLoading** | **hasError** |
| :-------- | :------------: | -----: | --------: | ------------- | ------------ |
| 1         |     false      |  false |      null | false         | false        |
| 2         |     false      |  false |      null | false         | true         |
| 3         |     false      |  false |      null | true          | false        |
| 4         |     false      |  false |      null | true          | true         |
| 5         |     false      |  false |    string | false         | false        |
| 6         |     false      |  false |    string | true          | false        |
| 7         |     false      |  false |    string | true          | true         |
| 8         |     false      |  false |    string | false         | true         |
| 9         |     false      |   true |      null | false         | false        |
| 10        |     false      |   true |      null | false         | true         |
| 11        |     false      |   true |      null | true          | false        |
| 12        |     false      |   true |      null | true          | true         |
| 13        |     false      |   true |    string | false         | false        |
| 14        |     false      |   true |    string | true          | false        |
| 15        |     false      |   true |    string | true          | true         |
| 16        |     false      |   true |    string | false         | true         |
| 17        |      true      |  false |      null | false         | false        |
| 18        |      true      |  false |      null | false         | true         |
| 19        |      true      |  false |      null | true          | false        |
| 20        |      true      |  false |      null | true          | true         |
| 21        |      true      |  false |    string | false         | false        |
| 22        |      true      |  false |    string | true          | false        |
| 23        |      true      |  false |    string | true          | true         |
| 24        |      true      |  false |    string | false         | true         |
| 25        |      true      |   true |      null | false         | false        |
| 26        |      true      |   true |      null | false         | true         |
| 27        |      true      |   true |      null | true          | false        |
| 28        |      true      |   true |      null | true          | true         |
| 29        |      true      |   true |    string | false         | false        |
| 30        |      true      |   true |    string | true          | false        |
| 31        |      true      |   true |    string | true          | true         |
| 32        |      true      |   true |    string | false         | true         |

Yep. 32 possible states for 5 pieces of state. And this is for state that only
has two possible values for each state. We've all seen states that have
significantly more possible values for each piece of state and significantly
more pieces of state. Consider if any one of these was a complex object that has
properties that are nullable. Things get out of hand really quick if you're not
careful in front end development.

## A Better Way to Model Your State

looking at the chart above and thinking about what _should_ be possible can get
us a long way in getting to a better data model. For example if we model our
state in such a way that if the user is not logged in then we can't have any of
these other states that reduces our possible states in half. Further should it
be possible to have both an error and loading at the same time? Probably not.
How about having an error message but `hasError` be false. Turns out that also
doesn't seem reasonable. What if we changed our model to only allow valid
states? What would that do to our possible states?

Lets look at another data model to explore this idea. Imagine we had the
following.

```typescript
interface Unauthenticated {
  isAuthenticated: false
}

interface Rejected {
  isAuthenticated: true
  hasError: true
  error: string
}

interface Pending {
  isAuthenticated: true
  isLoading: true
}

interface Success {
  isAuthenticated: true
  on: boolean
}

type ToggleState = Unauthenticated | Success | Rejected | Pending
```

Which would result in the following possible states:

| **count** | **isLoggedIn** | **on** | **error** | **isLoading** | **hasError** |
| :-------- | :------------: | :----: | :-------: | :-----------: | :----------: |
| 1         |     false      |  N/A   |    N/A    |      N/A      |     N/A      |
| 2         |      true      |  true  |    N/A    |      N/A      |     N/A      |
| 3         |      true      | false  |    N/A    |      N/A      |     N/A      |
| 4         |      true      |  N/A   |  string   |      N/A      |     true     |
| 5         |      true      |  N/A   |    N/A    |     true      |     N/A      |

and thats it! 32 possible states becomes just 5 possible states! Thats less than
1/6th of the possibilities. This is much simpler to comprehend and implement and
because we've modeled it in typescript the compiler will catch any places where
we are doing something that our business logic says shouldn't be possible. This
will result in much simpler and maintainable applications.

## Conclusion

By modeling our state correctly we are able to limit the amount of possibilities
we have to hold in our heads and consider and we get better TypeScript support.
This helps us to eliminate bugs while simplifying the business logic so its both
easier to understand and contains less surface area for bugs to creep into our
programs.
