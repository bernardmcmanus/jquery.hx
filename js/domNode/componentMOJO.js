hxManager.ComponentMOJO = (function( CSSProperty ) {


    var Object_defineProperty = Object.defineProperty;


    function ComponentMOJO() {

        var that = this;
        var order = {};

        MOJO.Hoist( that );

        Object.defineProperty( that , 'order' , {
            get: function() {
                return order;
            }
        });
    }


    ComponentMOJO.prototype = new MOJO({

        getString: function( type ) {

            var that = this;
            var order = that.getOrder( type );

            var arr = order
                .map(function( property ) {
                    var component = that.getComponents( type , property );
                    return component.isDefault() ? '' : component.string;
                })
                .filter(function( str ) {
                    return str !== '';
                });

            return arr.join( ' ' );
        },

        getComponents: function( type , property ) {

            var that = this;
            var _type, _property;
            var name = (property === 'value' ? type : property);

            if (type) {
                _type = (that[type] || {});
                if (property) {
                    _property = _type[property] || new CSSProperty( name , null );
                    return _property;
                }
                return _type;
            }

            return that;
        },

        updateComponent: function( bean ) {

            var that = this;
            var styles = bean.styles;
            var type = bean.type;
            var component = (that[type] = that[type] || {});

            MOJO.Each( styles , function( property , key ) {

                var name = (key === 'value' ? type : key);

                if (component[key] === undefined) {
                    component[key] = new CSSProperty( name , property );
                }
                else {
                    component[key].update( property );
                }

                if (component[key].isDefault()) {
                    delete component[key];
                    if (Object.keys( component ).length < 1) {
                        delete that[type];
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

            if (newOrder) {
                this.order[type] = newOrder;
            }
            else {
                delete this.order[type];
            }
        },

        _updateOrder: function( bean ) {
            
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
        }
    });


    return ComponentMOJO;

    
}( hxManager.CSSProperty ));




























