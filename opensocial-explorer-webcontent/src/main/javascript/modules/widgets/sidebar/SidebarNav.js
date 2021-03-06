/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin',
        'dojo/text!./../../templates/SidebarNav.html', 'dojo/dom-construct', 'modules/widgets/sidebar/SpecList',
        'modules/widgets/editorarea/EditorArea', 'modules/gadget-spec-service'],
        function(declare, WidgetBase, TemplatedMixin, template, domConstruct, SpecList, EditorArea,
                gadgetSpecService) {
            var SidebarNav = declare('SidebarNavWidget', [ WidgetBase, TemplatedMixin ], {
                templateString : template,
                
                constructor : function() {
                  this.specLists = [];
                },
                
                postCreate : function() {
                  var self = this;
                  gadgetSpecService.getSpecTree({
                    success : function(data) {
                      for(var i = 0; i < data.length; i++) {
                        for(var key in data[i]) {
                          var specList = new SpecList({"categoryName" : key, "specTree" : data[i][key]});
                          specList.addActivationListener(self.getActivationListener());
                          self.specLists.push(specList);
                          domConstruct.place(specList.domNode, self.domNode);
                          specList.startup();
                        }
                      }
                    },
                    error : function(data) {
                      console.error("There was an error");
                    }
                  });
                },
                
                getActivationListener : function(){
                  var self = this;
                  return {
                    "pre" : function() {
                      for(var i = 0; i < self.specLists.length; i++) {
                        self.specLists[i].deactivateLinks();
                      }
                    },
                    "post" : function(link) {
                      EditorArea.getInstance().setTitle(link.node.title);
                    }
                  };
                }
            });
            var instance;
            
            return {
              getInstance : function() {
                if(!instance) {
                  instance = new SidebarNav();
                }
                return instance;
              }
            };
        });