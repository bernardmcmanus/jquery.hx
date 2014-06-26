hxManager.ComponentMOJO = (function( Config , Helper ) {


    function ComponentMOJO() {
        var that = this;
        that.order = {};
        MOJO.Hoist( that );
    }


    var ComponentMOJO_prototype = (ComponentMOJO.prototype = new MOJO());


    ComponentMOJO_prototype.getString = function( type ) {

        var that = this;
        var order = that.getOrder( type );

        //console.log(order);

        var arr = order.map(function( property ) {
            return that.getComponents( type , property ).string;
        });

        //console.log(arr);

        return arr.join( ' ' );
    };


    ComponentMOJO_prototype.getComponents = function( type , property ) {

        var that = this;

        if (type) {
            that[type] = (that[type] = that[type] || {});
            if (property) {
                that[type][property] = that[type][property] || [];
                return that[type][property];
            }
            return that[type];
        }

        return that;
    };


    /*ComponentMOJO_prototype._setComponent = function( type , newComponent ) {

        var that = this;

        var updated = {};
        var keys = Object.keys( newComponent );
        var defaults = Config.getDefaults( type , keys );

        for (var property in newComponent) {
            var value = newComponent[property];
            if (Helper.compareArray( value , defaults[property] )) {
                that.deleteComponent( type , property );
            }
            else {
                updated[property] = value;
            }
        }

        updated = $.extend( that.getComponents( type ) , updated );
        that[type] = updated;
    };*/


    /*ComponentMOJO_prototype.deleteComponent = function( type , property ) {
        
        var that = this;

        if (property) {
            delete that[type][property];
        }
        else {
            delete that[type];
        }
    };*/


    ComponentMOJO_prototype.updateComponent = function( bean ) {

        var CSSFactory = hxManager.CSSFactory;

        var that = this;
        var styles = bean.styles;
        var component = (that[bean.type] = that[bean.type] || {});
        var keyMap = Config.maps.property;
        var key, mappedKey;

        for (key in styles) {

            mappedKey = keyMap[key] || key;

            if (component[mappedKey] === undefined) {
                component[mappedKey] = CSSFactory( key , mappedKey , styles[key] );
            }
            else {
                component[mappedKey].update( styles[mappedKey] );
            }

            if (component[mappedKey].isDefault()) {
                delete component[mappedKey];
            }
        }

        that._updateOrder( bean );
    };


    ComponentMOJO_prototype.getOrder = function( type ) {

        var that = this;

        var order = that.order;

        if (type) {
            order[type] = (that.order[type] = that.order[type] || []);
            return order[type];
        }

        return order;
    };


    ComponentMOJO_prototype.setOrder = function( type , newOrder ) {
        if (newOrder) {
            this.order[type] = newOrder;
        }
        else {
            delete this.order[type];
        }
    };


    ComponentMOJO_prototype._updateOrder = function( bean ) {
        
        var that = this;

        var type = bean.type;
        var storedOrder = that.getOrder( type );
        var passedOrder = bean.order.passed;
        var computedOrder = bean.order.computed;
        var newOrder = (passedOrder.concat( storedOrder )).concat( computedOrder );

        var componentKeys = Object.keys( that.getComponents( type ));

        newOrder = newOrder.filter(function( property , i ) {
            return (newOrder.indexOf( property ) === i && componentKeys.indexOf( property ) >= 0);
        });

        that.setOrder( type , newOrder );
    };


    return ComponentMOJO;

    
}( hxManager.Config , hxManager.Helper ));




























