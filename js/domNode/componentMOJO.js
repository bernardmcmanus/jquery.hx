var MOJO = require( 'mojo' );
var helper = require( 'shared/helper' );
var StyleDefinition = require( 'domNode/styleDefinition' );
var CSSProperty = require( 'domNode/cssProperty' );

module.exports = ComponentMOJO;

function ComponentMOJO() {
    var that = this;
    var order = {};
    MOJO.Construct( that );
    helper.defProp( that , 'order' , { value: order });
}

ComponentMOJO.prototype = MOJO.Create({
    getString: function( type ) {
        var that = this;
        var order = that.getOrder( type );
        var arr = order
            .map(function( key ) {
                var name = getPropertyName( type , key );
                var component = that.getComponents( name );
                component = helper.has( component , 'value' ) ? component.value : component;
                if ($.hx.preFilter) component = $.hx.preFilter(component);
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
            out = helper.treeSearch( that , find );
        }
        if (helper.isUndef( out )) {
            out = StyleDefinition.isDefined( find ) ? new CSSProperty( find , null ) : {};
        }
        return out;
    },
    updateComponent: function( bean ) {
        var that = this;
        var styles = bean.styles;
        var type = bean.type;
        var component = (that[type] = that[type] || {});
        helper.each( styles , function( property , key ) {
            var name = getPropertyName( type , key );
            if (helper.isUndef( component[key] )) {
                component[key] = new CSSProperty( name , property );
            }
            else {
                component[key].update( property );
            }
            if (component[key].isDefault()) {
                helper.del( component , key );
                if (helper.length(helper.keys( component )) < 1) {
                    helper.del( that , type );
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
            helper.del( order , type );
        }
    },
    _updateOrder: function( bean ) {  
        var that = this;
        var type = bean.type;
        var storedOrder = that.getOrder( type );
        var passedOrder = bean.order.passed;
        var computedOrder = bean.order.computed;
        var newOrder = passedOrder.concat( storedOrder , computedOrder );
        var componentKeys = helper.keys( that.getComponents( type ));
        newOrder = newOrder.filter(function( property , i ) {
            return (helper.indexOf( newOrder , property ) === i && helper.indexOf( componentKeys , property ) >= 0);
        });
        that.setOrder( type , newOrder );
    }
});

function getPropertyName( type , property ) {
    return (property === 'value' ? type : property);
}
