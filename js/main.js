$(document).ready(function () {
    main();
});

function main() {
    loadLinkIcons();
}

function loadLinkIcons() {
    var icons_container = $('div.icons-container');

    $.getJSON(icons_container.attr('data-links-source'), function (links) {
        $.map(links, function (link) {
            icons_container.append(generateLinkIcon(link));
        });
    });
}


function generateLinkIcon(link) {
    var icon = $('<i>');
    icon.addClass('fab').addClass('fa-' + link['title'].toLowerCase());

    var anchor = $('<a>');
    anchor.attr('href', link['href']);
    anchor.attr('title', link['title']);
    anchor.append(icon);

    var inner_div = $('<div>');
    inner_div.addClass('mx-auto').addClass('d-block').addClass('text-center');
    inner_div.append(anchor);

    var outer_div = $('<div>');
    outer_div.addClass('col-xs-12').addClass('col-sm-6').addClass('col-md-4');
    outer_div.append(inner_div);

    return outer_div;
}