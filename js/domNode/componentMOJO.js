hxManager.ComponentMOJO = (function(
    Object,
    MOJO,
    Helper,
    StyleDefinition,
    CSSProperty
) {


    var UNDEFINED;


    var TreeSearch = Helper.treeSearch;
    var Del = Helper.del;
    var isUndef = Helper.isUndef;


    function ComponentMOJO() {

        var that = this;
        var order = {};

        MOJO.Construct( that );

        Object.defineProperty( that , 'order' , {
            value: order
        });
    }


    ComponentMOJO.prototype = MOJO.Create({

        getString: function( type ) {

            var that = this;
            var order = that.getOrder( type );

            var arr = order
                .map(function( property ) {
                    var component = that.getComponents( property );
                    return component.isDefault() ? '' : component.string;
                })
                .filter(function( str ) {
                    return str !== '';
                });

            return arr.join( ' ' );
        },

        getComponents: function( find ) {

            var that = this;
            var out = that;

            if (find) {
                out = TreeSearch( that , find );
            }

            if (isUndef( out )) {
                out = StyleDefinition.isDefined( find ) ? new CSSProperty( find , null ) : {};
            }

            return out;
        },

        updateComponent: function( bean ) {

            var that = this;
            var styles = bean.styles;
            var type = bean.type;
            var component = (that[type] = that[type] || {});

            MOJO.Each( styles , function( property , key ) {

                var name = (key === 'value' ? type : key);

                if (isUndef( component[key] )) {
                    component[key] = new CSSProperty( name , property );
                }
                else {
                    component[key].update( property );
                }

                if (component[key].isDefault()) {
                    Del( component , key );
                    if (Object.keys( component ).length < 1) {
                        Del( that , type );
                    }
                }
            });

            that._updateOrder( bean );
        },

        getOrder: function( type ) {

            var that = this;
            var order = that.order;

            if (type) {
                return order[type] || [];
            }

            return order;
        },

        setOrder: function( type , newOrder ) {

            var that = this;
            var order = that.order;

            if (newOrder) {
                order[type] = newOrder;
            }
            else {
                Del( order , type );
            }
        },

        _updateOrder: function( bean ) {
            
            var that = this;

            var type = bean.type;
            var storedOrder = that.getOrder( type );
            var passedOrder = bean.order.passed;
            var computedOrder = bean.order.computed;
            var newOrder = passedOrder.concat( storedOrder , computedOrder );

            var componentKeys = Object.keys( that.getComponents( type ));

            newOrder = newOrder.filter(function( property , i ) {
                return (newOrder.indexOf( property ) === i && componentKeys.indexOf( property ) >= 0);
            });

            that.setOrder( type , newOrder );
        }
    });


    return ComponentMOJO;

    
}(
    Object,
    MOJO,
    hxManager.Helper,
    hxManager.StyleDefinition,
    hxManager.CSSProperty
));




























