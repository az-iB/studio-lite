/**
 Application router for FasterQ terminal applications
 well as management for sizing events
 @class fasterQTerminalController
 @constructor
 @return {Object} instantiated AppRouter
 **/
define(['underscore', 'jquery', 'backbone', 'XDate', 'StackView', 'FasterQCustomerTerminal', 'LineModel'], function (_, $, Backbone, XDate, StackView, FasterQCustomerTerminal, LineModel) {

    BB.SERVICES.FASTERQ_TERMINAL_ROUTER = 'FASTERQ_TERMINAL_ROUTER';

    var fasterQTerminalController = BB.Controller.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
            var self = this;
            BB.comBroker.setService(BB.SERVICES['FASTERQ_TERMINAL_ROUTER'], self);
            BB.comBroker.setService('XDATE', new XDate());
            $(window).trigger('resize');
            self._initUserTerminal();
        },

        _initUserTerminal: function () {
            var self = this;

            var param = $.base64.decode(self.options.param).split(':');
            var businessID = param[0];
            var lineID = param[1];

            self.m_terminalModel = new LineModel({
                line_id: lineID
            });


            self.m_terminalModel.fetch({
                data: {
                    businessID: businessID
                },
                success: (function (model, data) {
                    self.m_fasterQCustomerTerminalView = new FasterQCustomerTerminal({
                        el: Elements.FASTERQ_CUSTOMER_TERMINAL,
                        model: self.m_terminalModel
                    });
                    self.m_stackView = new StackView.Fader({duration: 333});
                    self.m_stackView.addView(self.m_fasterQCustomerTerminalView);
                    self.m_stackView.selectView(self.m_fasterQCustomerTerminalView);

                }),
                error: (function (e) {
                   log('Service request failure: ' + e);
                }),
                complete: (function (e) {
                })
            });
        }
    });

    return fasterQTerminalController;
});