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

