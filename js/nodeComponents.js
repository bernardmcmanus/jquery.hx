hxManager.NodeComponents = (function( Config , Helper ) {


    function NodeComponents() {
        var that = this;
        that.order = {};
        MOJO.Hoist( that );
    }


    var NodeComponents_prototype = (NodeComponents.prototype = new MOJO());


    NodeComponents_prototype.getStyleString = function( type ) {

        var that = this;

        var stringMap = Config.maps.styleString;
        var order = that.getOrder( type );

        var arr = order.map(function( name ) {
            var property = that.getComponents( type , name );
            var map = getPropertyMap( name );
            if (map) {
                return name + '(' + property.join( map.join ) + map.append + ')';
            }
            return property[0];
        });

        function getPropertyMap( name ) {
            var re;
            for (var key in stringMap) {
                re = new RegExp( key , 'i' );
                if (re.test( name )) {
                    return stringMap[key];
                }
            }
            return false;
        }

        return arr.join( ' ' );
    };


    NodeComponents_prototype.getComponents = function( type , property ) {

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


    NodeComponents_prototype._setComponent = function( type , newComponent ) {

        var that = this;

        var updated = {};
        var keys = Object.keys( newComponent );
        var defaults = Config.getDefaults( type , keys );

        for (var property in newComponent) {
            var value = newComponent[property];
            if (Helper.array.compare( value , defaults[property] )) {
                that.deleteComponent( type , property );
            }
            else {
                updated[property] = value;
            }
        }

        updated = $.extend( that.getComponents( type ) , updated );
        that[type] = updated;
    };


    NodeComponents_prototype.deleteComponent = function( type , property ) {
        if (property) {
            delete this[type][property];
        }
        else {
            delete this[type];
        }
    };


    NodeComponents_prototype.updateComponent = function( bean ) {

        var that = this;

        var type = bean.type;
        var compiled = bean.compiled;
        var defaults = bean.defaults;
        var rules = bean.rules;
        var newComponents = {};

        for (var name in compiled) {

            var compiledProperty = compiled[name];
            var ruleProperty = rules[name];
            var defaultProperty = defaults[name];
            var storedProperty = $.extend( [] , defaultProperty , that.getComponents( type , name ));
            
            newComponents[name] = storedProperty.map( mapCallback );
        }

        function mapCallback( storedVal , i ) {

            // if ruleProperty[i] is true, update the stored value
            if (ruleProperty[i]) {
                return mergeUpdates( storedVal , compiledProperty[i] );
            }

            // otherwise, leave it as is
            return storedVal;
        }

        function mergeUpdates( storedVal , newVal ) {
            var _eval = eval;
            var parts = parseExpression( newVal );
            return (parts.op ? _eval(storedVal + parts.op + parts.val) : parts.val);
        }

        that._setComponent( type , newComponents );
        that._updateOrder( bean );
    };


    NodeComponents_prototype.getOrder = function( type ) {

        var that = this;

        var order = that.order;

        if (type) {
            order[type] = (that.order[type] = that.order[type] || []);
            return order[type];
        }

        return order;
    };


    NodeComponents_prototype.setOrder = function( type , newOrder ) {
        if (newOrder) {
            this.order[type] = newOrder;
        }
        else {
            delete this.order[type];
        }
    };


    NodeComponents_prototype._updateOrder = function( bean ) {
        
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


    function parseExpression( exp ) {

        var re = /((\+|\-|\*|\/|\%){1})+\=/;
        var out = {op: null, val: 0};
        var match = re.exec( exp );

        if (match) {
            out.op = match[1];
            exp = exp.replace( re , '' );
        }

        out.val = exp;

        if (out.op) {
            out.val = parseFloat( out.val , 10 );
        }
        
        return out;
    }


    return NodeComponents;

    
}( hxManager.Config , hxManager.Helper ));




























