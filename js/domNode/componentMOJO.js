hxManager.ComponentMOJO = hxManager.Inject(
[
    MOJO,
    'StyleDefinition',
    'CSSProperty',
    'treeSearch',
    'defProp',
    'keys',
    'indexOf',
    'length',
    'del',
    'isUndef'
],
function(
    MOJO,
    StyleDefinition,
    CSSProperty,
    treeSearch,
    defProp,
    keys,
    indexOf,
    length,
    del,
    isUndef
){


    var VALUE = 'value';


    function ComponentMOJO() {

        var that = this;
        var order = {};

        MOJO.Construct( that );

        defProp( that , 'order' , {
            value: order
        });
    }


    ComponentMOJO.prototype = MOJO.Create({

        getString: function( type ) {

            var that = this;
            var order = that.getOrder( type );

            var arr = order
                .map(function( key ) {
                    var name = getPropertyName( type , key );
                    var component = that.getComponents( name );
                    component = (key === VALUE ? component[VALUE] : component);
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
                out = treeSearch( that , find );
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

                var name = getPropertyName( type , key );

                if (isUndef( component[key] )) {
                    component[key] = new CSSProperty( name , property );
                }
                else {
                    component[key].update( property );
                }

                if (component[key].isDefault()) {
                    del( component , key );
                    if (length(keys( component )) < 1) {
                        del( that , type );
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
                del( order , type );
            }
        },

        _updateOrder: function( bean ) {
            
            var that = this;

            var type = bean.type;
            var storedOrder = that.getOrder( type );
            var passedOrder = bean.order.passed;
            var computedOrder = bean.order.computed;
            var newOrder = passedOrder.concat( storedOrder , computedOrder );

            var componentKeys = keys( that.getComponents( type ));

            newOrder = newOrder.filter(function( property , i ) {
                return (indexOf( newOrder , property ) === i && indexOf( componentKeys , property ) >= 0);
            });

            that.setOrder( type , newOrder );
        }
    });


    function getPropertyName( type , property ) {
        return (property === VALUE ? type : property);
    }


    return ComponentMOJO;

});



























