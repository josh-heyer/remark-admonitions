# This is a test
:::note
This is what a note looks like
:::

:::tip
It works great with docusaurus 2.0
:::

:::caution you can set *your own* title
it replaces the default title
:::

:::important credit
Based on `remarkable-admonitions`

SVG Icons by GitHub Octicons
:::

:::warning
You can't nest them
* but
* you
* can
* nest
* other
* markdown

```javascript
// you can even use block elements
```
:::

:::custom
You can make your own custom types. The icon, keyword, and emoji can be set in the plugin options and they can be styled separately.
:::

## Indented 

::: Note with a title

::: Note "with a quoted title"

::: Note
    with a default title

::: Note ""
    without any title

:::important IMPORTANT TITLE HERE
    You can have [markdown](www.google.com) in here, neat

1.  A list

2.  With items

    > :::tip TIP TITLE HERE
    >     You can have [markdown](www.google.com) in here, neat
    >    ```
        including fenced code
        ```

3.  And stuff

:::note NOTE TITLE HERE
You can have [markdown](www.google.com) in here, neat
:::

:::warning ""
    You can have [markdown](www.google.com) in here, neat

::: danger Indented code block in fenced admonition

    You can have [markdown](www.google.com) in here, neat

:::


::: Note How about... Admonition within an admonition?

    Blah blah blah

    ::: Danger
        Whoa!

## Escaping

::: important Escaping the tag allows you to change the behavior

    This could be code or a paragraph depending whether a backslash precedes the tag

\:::

\::: note this is not a note
    it's something else - note also that this doesn't need to be escaped \::: because the parser won't recognize it. Escaping it does no harm though!

The same goes for code blocks:

    ::: note that this isn't a note, it's a code block
    neither the start nor end tag needs to be escaped
    as code blocks have precedence in the parser
    this is important, as normally we would not want to
    have to escape anything within a code block
    ::: 

- This is a list
- \::: note that notes need to be escaped here
       otherwise, things will break

> when in doubt,
> it doesn't hurt to escape
> \::: note s or other admonitions
> it won't hurt anything
