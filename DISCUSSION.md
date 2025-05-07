## Summary

The assignment started with a fairly barebones (and broken) application.
The recommendation was to spend no more than 2 hours so I decided to plan for what I could realistically deliver and improve across the entire stack of the application.

I realized early on that the actual search mechanism should be moved server-side. This led me to a path of optimizing the underlying data model for multi-column full text search and filtering. You can read more details about my thoughts in my [first PR](https://github.com/mariusespejo/solace/pull/1).

Next, I created a simple advocates API, which allows for fairly performant search, filtering, and pagination. You can see my implementation on the [second PR](https://github.com/mariusespejo/solace/pull/2).

Finally, I focused on making the UI functional with a much better look and feel. At this point we have what I believe to be a reasonable "MVP" for this assignment. You can see my final changes and a recorded demo in my [third PR](https://github.com/mariusespejo/solace/pull/3).

## A quick callout
I thought that it was worth mentioning that anyone who has Next.JS experience would know that we didn't really need to build an API.

React Server Components gives us the ability to talk to external APIs or even the database directly if we wanted to. This opens up a bunch of potential improvements, e.g. instant loading states, streaming, etc. Not to mention the overall performance improvements that we can get by removing "waterfalls" like rendering the client --> making API calls --> re-rendering the client... we technically could render quite a lot server-side and only return the absolute minimum necessary JS.

Next also comes with a lot of caching capabilities but the semantics of that differs between v14 and v15 so I decided not to complicate the assignment with that for now.

Anyways I just wanted to mention that with my experience with Next specifically I would have done things quite a bit differently, but I wanted to stick to the constraint that was given by the assignment (that we need to make actual API calls to the backend).

## Areas of opportunity 
As mentioned I decided to do what felt like "enough" work across the stack to showcase my knowledge and experience. However if I were given more time there are definitely endless possibilities of things to improve.

Here are a couple things that I thought were worth mentioning:
- Search
  - We could have opted for a simpler backend where instead of using text-based search across multiple fields, we maybe could have limited it to just the first and last names. Then we could simply create additonal standalone filters for the other fields. This would have the tradeoff of a slightly more complicated UI but potentially more intuitive to users (vs a magical "search it all" box). This would have taken the most time to implement for this assignment which is why I decided against it.
  - We could have also went all in on a more powerful search by utilizing tools like ElasticSearch. However that requires more infrastrcture. I felt that would have been overkill for a simple assignment, hence why I took the middle ground approach of utilizing Postgres full text search
- Data Model & API
  - From a UX perspective it would have been great to add the ability to sort the search results based on any of the columns. 
  - Rather than having a single "city" column, it would been more realistic to have some kind of `locations` table which could include other fields such as state/province and country. I also think that location in general is another candidate for a standalone filter
- Client / UI
  - I didn't really have the time to implement a table filter for `specialties` I was thinking it could be some kind of multi-select set of tags or a simpler dropdown
  - A dropdown for different ranges of years of experience would have also been great, e.g. 1-5 years, 5+, 10+ etc.
  - Although I added support for pagination on the API, I didn't have time to implement it on the frontend
  - I also thought about having a search box which auto submits (debounced) the input, allowing the UI to automatically refresh as the user types
  - If we were truly forced to make API calls from the browser, I would normally utilize tanstack query which gives us a ton of beneficial features such as automatically tracked loading/error/success states, caching & revalidation, etc.
  - If I had the time to implement the extra filters, I would have utilized state management tools like `zustand`. We also could have maintained the state in the browser URL itself, allowing for bookmarkable/shareable searches
- Other
  - In a real application, depending on where it might benefit, caching is often useful to have specially if the advocate data does not change that often
  - Unit and Integration tests are also great to have, it can help document the code and reduce bugs in critical paths
  - In terms of UX, depending on how hard it actually is for a user to find an advocate, I would suggest considering a "turbotax-like" approach where we guide users into their search results by individually asking what they're looking for. Then allow them to refine the results with various filters.