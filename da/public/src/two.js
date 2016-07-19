$(function() {
    var user_id = $.getUrlParam("user_id");
    var sid = $.getUrlParam("sid");
    if (!user_id || !sid) {
        window.location.href = "./login.html";
    } else {
    var option = {
            title : {
                // text: '个平台视频播放总量对比',
                // subtext: '对比间距：天'
            },
            tooltip : {
                trigger: 'item'
            },
            legend: {
                // data:['芈月传']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true,  type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    // type : 'category',
                    // boundaryGap : false,
                    // data : ['00:00','8:00','12:00','22:00']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} 万'
                    }
                }
            ],
            series : [
                {
                    // name:'芈月传',
                    // type:'line',
                    // data:[11, 11, 15, 13],
                },
            ]
    };

    var Nav = React.createClass({
        search: function (type) {
            name = this.refs.search_input.value;
            if (name) {
                url = './two.html?name='+ name + '&type=' + type + "&user_id=" + user_id + "&sid=" + sid;
                window.location.href = url;
            }
        },
        componentDidMount: function() {
            if($.getUrlParam("type") == "teleplay") {
                $(".type:first").css({background: "#FFAA33"});
            } else {
                $(".type:last").css({background: "#FFAA33"});
            }
        },
        render: function() {
            return (
                <div id="nav">
                    <ul>
                        <li id="filter_1">
                            <div className="margin-position">
                                <button className="type" name="teleplay">电视剧</button>
                                <button className="type" name="variety">综艺</button>
                                <input id="search_input" type="text" placeholder="输入剧名/综艺搜索" ref='search_input' />
                                <button className="search_button border-right" onClick={this.search.bind(this, type='teleplay')}>搜索电视</button>
                                <button className="search_button" onClick={this.search.bind(this, type='variety')}>搜索综艺</button>
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
    });

    var PlayInfoChartDay = React.createClass({
        loadPlayInfo: function() {
            type = $.getUrlParam('type');
            name = $.getUrlParam('name');
            $.ajax({
                url: this.props.url + '/by_time_index?type=' + type + '&name=' + name + '&index=day' + "&sid=" + sid,
                cache: false,
                type: 'get',
                success: function(play_infos) {
                    play_infos = $.parseJSON(play_infos);
                    if(play_infos.series.length) {
                        myChart = echarts.init(document.getElementById('all_play_info_chart_day'));
                        option.title = play_infos.title;
                        option.legend = play_infos.legend;
                        option.series = play_infos.series;
                        option.xAxis = play_infos.xAxis;
                        myChart.setOption(option);
                    }
                }.bind(this),
                error: function(xhr, status,err) {
                    console.log(xhr, status, err.toString());
                }
            });
        },
        componentDidMount: function() {
            this.loadPlayInfo();
        },
        render: function() {
            return (
                <div>
                    <div id="all_play_info_chart_day"></div>
                </div>
            );
        }
    });



    var PlayInfoChartHours = React.createClass({
        loadPlayInfo: function() {
            type = $.getUrlParam('type');
            name = $.getUrlParam('name');
            $.ajax({
                url: this.props.url + '/by_time_index?type=' + type + '&name=' + name + '&index=hours' + "&sid=" + sid,
                cache: false,
                type: 'get',
                success: function(play_infos) {
                    play_infos = $.parseJSON(play_infos);
                    if(play_infos.series.length) {
                        myChart = echarts.init(document.getElementById('all_play_info_chart_hours'));
                        option.title = play_infos.title;
                        option.legend = play_infos.legend;
                        option.series = play_infos.series;
                        option.xAxis = play_infos.xAxis;
                        myChart.setOption(option);
                    }
                }.bind(this),
                error: function(xhr, status,err) {
                    console.log(xhr, status, err.toString());
                }
            });
        },
        componentDidMount: function() {
            this.loadPlayInfo();
        },
        render: function() {
            return (
                <div>
                    <div id="all_play_info_chart_hours"></div>
                </div>
            );
        }
    });


    var AllPlayInfoTable = React.createClass({
        loadPlayInfo: function() {
            type = $.getUrlParam('type');
            name = $.getUrlParam('name');
            $.ajax({
                url: this.props.url + '/table?type=' + type + '&name=' + name + "&sid=" + sid,
                cache: false,
                type: 'get',
                success: function(play_infos) {
                    play_infos = JSON.parse(play_infos);
                    var playInfoNodes = play_infos.map(function(play_info) {
                        return (
                            <tr key={play_info.id}>
                                <td>{play_info.platform}</td>
                                <td>{play_info.all_play_counts}</td>
                                <td>{play_info.avg_play}</td>
                                <td>{play_info.day_play_counts}</td>
                                <td>{play_info.time_at}</td>
                            </tr>
                            );
                    });
                    this.setState({play_infos: playInfoNodes});
                }.bind(this),
                error: function(xhr, status,err) {
                    console.log(xhr, status, err.toString());
                }
            });
        },
        componentDidMount: function() {
            this.loadPlayInfo();
        },
        getInitialState: function() {
            return {play_infos: []};
        },
        render: function() {

            return (
                <div id="all_play_info">
                    <div className="title">各平台播放量一览</div>
                    <table>
                        <thead>
                            <tr>
                                <td></td>
                                <td>总播放(万)</td>
                                <td>集均播放(万)</td>
                                <td>今日播放(万)</td>
                                <td>最近抓取更新时间</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.play_infos}
                        </tbody>
                    </table>
                </div>
                );
        }
    });

    var Intro = React.createClass({
        render: function() {
            if (this.props.tv_info) {
                return (
                    <div id="intro">
                        <div className="name">
                            <span>剧名：</span> {this.props.tv_info.name}
                        </div>
                        <div><span>类型：</span> {this.props.tv_info.type}</div>
                        <div><span>更新:</span> {this.props.tv_info.current_number} 集/<span>共:</span> {this.props.tv_info.all_number} 集</div>
                        <div className="intro"><span>主要演员：</span>
                            <div>{this.props.tv_info.cast_member}</div>
                        </div>
                            <div className="intro"><span>视频简介: </span>
                            <div dangerouslySetInnerHTML={{__html: this.props.tv_info.description}}>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return <div></div>
            }
        }
    });

    var Logo = React.createClass({
        render: function(){
            return (
                <div className="logo">

                </div>
            );
        }
    });

    var Two = React.createClass({
        loadTvInfo: function() {
            type = $.getUrlParam('type');
            name = $.getUrlParam('name');
            $("#home_title").text(name);
            $.ajax({
                url: this.props.url + '?type=' + type + '&name=' + name + "&sid=" + sid,
                cache: false,
                type: 'get',
                success: function(tv_info) {
                    this.setState({tv_info: JSON.parse(tv_info)});
                }.bind(this),
                error: function(xhr, status,err) {
                    console.log(xhr, status, err.toString());
                }
            });
        },
        getInitialState: function() {
            return {tv_info: []};
        },
        componentDidMount: function() {
            this.loadTvInfo();
        },
        render: function() {
            return (
                <div>
                    <Logo></Logo>
                    <Nav></Nav>
                    <Intro tv_info={this.state.tv_info}></Intro>
                    <AllPlayInfoTable url={this.props.url}></AllPlayInfoTable>
                    <PlayInfoChartDay url={this.props.url}></PlayInfoChartDay>
                    <PlayInfoChartHours url={this.props.url}></PlayInfoChartHours>
                </div>
            );
        }
    });

    ReactDOM.render(
      <Two url={"./api/v1/user/" + user_id + "/two"}></Two>,
      document.getElementById('two')
    );
                    // <AllPlayInfoTable data={this.state.data}></AllPlayInfoTable>
      //

    }

});
