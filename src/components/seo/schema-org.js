import React from 'react'
import Helmet from 'react-helmet'

export default React.memo(
  ({
    author,
    canonicalUrl,
    datePublished,
    defaultTitle,
    description,
    image,
    organization,
    title,
    url,
  }) => {
    const schema = [
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        url,
        name: title,
        alternateName: defaultTitle,
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': url,
              name: title,
              image,
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url,
        name: title,
        alternateName: defaultTitle,
        headline: title,
        image: {
          '@type': 'ImageObject',
          url: image,
        },
        description,
        author: {
          '@type': 'Person',
          name: author.name,
        },
        publisher: {
          '@type': 'Organization',
          url: organization.url,
          logo: organization.logo,
          name: organization.name,
        },
        mainEntityOfPage: {
          '@type': 'WebSite',
          '@id': canonicalUrl,
        },
        datePublished,
      },
    ]

    return (
      <Helmet>
        {/* Schema.org tags */}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    )
  },
)
