/* ToDo Delete
// alert("Hello");
 */
/* todo  delete  */
(function($){
    var ajaxRequest;
    var renderProducts;
    var registerEvents;
    var counter = 1;

    ajaxRequest = function(url){
        $.ajax(url, {
            error: function(jqXhr, status, message){
                console.error('error');
                console.dir(arguments);
            },
            success: function(data, status, jqXhr){
                renderProducts(data);
            }
        });
    };

    renderProducts = function(data) {
        var prodId;
        var prod;
        var html = '<p>Counter: ' + counter + '</p></p><table><tr><th>Name</th><th>Country</th></tr>';
        for (prodId in data) {
            prod = data[prodId];
            html += '<tr><td>' + prod.name + '</td><td>' + prod.country + '</td></tr>';
        }
        html += '</table>';
        $('#js-container-products').html(html);
        ++counter;
    };

    registerEvents = function() {
        $('#js-show-products').on('click', function(event) {
            event.preventDefault();
            ajaxRequest('/data/products');
        });
    }

    $(function(){
       registerEvents();
    });

})(jQuery);

