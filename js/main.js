var global_sections = {};


$(document).ready(function () {
    main();
});


function main() {
    loadSections();
    loadLinkIcons();
    loadShowsList();
}

function loadSections() {
    var sections = $('div.section');
    var done = false;
    for (var i = 0; !done; i++) {
        done = sections[i] === undefined;
        if (!done) {
            var section = $(sections[i]);
            global_sections[section.attr('id')] = section;
        }
    }
    var current_section = window.location.hash.substring(1);
    if (!global_sections.hasOwnProperty(current_section)) {
        current_section = 'main';
    }

    sectionChanger(current_section)();
}

function sectionChanger(name) {
    return function() {
        for (var n in global_sections) {
            if (global_sections.hasOwnProperty(n)) {
                global_sections[n].hide();
            }
        }
        global_sections[name].show();
        window.location.replace(`#${name}`)
    }
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
    // https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use
    var icon_name = link['icon'];
    var icon_class = 'fas';  // style: solid

    if (! icon_name) {
        icon_name = link['title'].toLowerCase();
        icon_class = 'fab';  // style: brands
    }

    var icon = $('<i>');
    icon.addClass('gray').addClass(icon_class).addClass(`fa-${icon_name}`);

    var anchor = $('<a>');
    anchor.addClass('icon');

    var href = link['href'];
    if (href) {
        anchor.attr('href', link['href']);
    }
    else {
        anchor.click(sectionChanger(link['section']));
    }

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


function loadShowsList() {
    var shows_container = $('div.shows-container');

    $.getJSON(shows_container.attr('data-shows-source'), function (shows) {
        var future_list = $('<ul>');
        var past_list = $('<ul>');
        var now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        $.map(shows, function (show) {
            var show_date = new Date(1000 * show['date']);
            var show_list_item = generateShowListItem(show, show_date);
            if (show_date < now) {
              past_list.append(show_list_item);
            } else {
              future_list.append(show_list_item);
            }
        });

        var title_bar = $('<h2>').addClass('text-center').addClass('my-4').html('Fechas ');
        var return_link = $('<a>').html('(volver)').attr('href', '#main').click(sectionChanger('main'));
        title_bar.append(return_link)

        shows_container.append(title_bar);
        shows_container.append(future_list);
        shows_container.append($('<h3>').html('Pasadas:'));
        shows_container.append(past_list);
    });
}

function generateShowListItem(show, show_date) {
    // Format date as dd/mm/yyyy
    var dd = ('0' + show_date.getUTCDate()).slice(-2);
    var mm = ('0' + (show_date.getUTCMonth() + 1)).slice(-2);
    var yyyy = show_date.getUTCFullYear();

    var more_info_link = $('<a>');
    more_info_link.attr('href', show['more_info_link']);
    more_info_link.attr('title', 'Click para más informción del evento');
    more_info_link.html('(+info)');

    var item = $('<li>');
    item.append(`${dd}/${mm}/${yyyy} - ${show['name']}, ${show['place']} `);
    item.append(more_info_link);
    return item;
}
