<html>
<head>
<title>testing handlebars with moonrails</title>
</head>
<body>
<ul>
{{#each links}}
    <li> <a href="{{this.href}}" title="{{this.title}}">{{this.description}}</a> </li>
{{/each}}
</ul>
</body>
</html>