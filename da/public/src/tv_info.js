var _limit = 20;
var _offset = 0;
var _continue = true
var option = {
        title : {
            text: '视频播放今日一览',
            subtext: '4个时段，地区：全国'
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

var ChartInfo = React.createClass({
    loadPlayInfo: function() {
        search_name = this.refs.search_by_name.value;
        if (!search_name) {
            return false;
        }
        $.ajax({
            url: this.props.url + '/' + search_name,
            cache: false,
            type: 'get',
            success: function(play_infos) {
                play_infos = $.parseJSON(play_infos);
                if(play_infos.series.length) {
                    myChart = echarts.init(document.getElementById('single_chart_info'));
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
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        myChart = echarts.init(document.getElementById('single_chart_info'));
        myChart.setOption(option);
    },
    render: function() {
        return (
            <div id="single_chart">
                <h3 id="single_chart_info_title" >剧目/综艺今日播放一览</h3>
                <div className="single_and_compare">
                    <input id="search_by_name" type="text" placeholder="多个名字请用空格分隔"  ref="search_by_name"/>
                    <a id="search_by_name_button" onClick={this.loadPlayInfo}>搜索</a>
                </div>
                <div id="single_chart_info" ></div>
            </div>
        );
    }
});

var AllPlayInfo = React.createClass({
    render: function() {
        var playInfoNodes = this.props.data.map(function(play_info) {
            return (
                    <tr key={play_info.id}>
                        <td><a href={"./two.html?name=" + play_info.name + "&type=" +play_info.type}
                               target="_blank">{play_info.name}</a></td>
                        <td>{play_info.time_at}</td>
                        <td>{play_info.day_play_counts}</td>
                        <td>{play_info.all_play_counts}</td>
                        <td>{play_info.avg_play}</td>
                        <td>{play_info.current_number}/{play_info.all_number}</td>
                        <td>{play_info.cast_member}</td>
                    </tr>
            );
        });
        return (
            <div id="all_play_info">
                <div id="gride_info">
                    <table>
                        <thead>
                            <tr>
                                <td>剧名</td>
                                <td>日期</td>
                                <td>今日播放量(万)</td>
                                <td>总播放量(万)</td>
                                <td>集均播放量(万)</td>
                                <td>更新_集/共_集</td>
                                <td>主演</td>
                            </tr>
                        </thead>
                        <tbody>
                            {playInfoNodes}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td id ="page_turn" colSpan='7' onClick={this.props.pageTurn}>{this.props.flag}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
});

var Nav = React.createClass({
    search: function (type) {
        name = this.refs.search_input.value;
        if (name) {
            url = './two.html?name='+ name + '&type=' + type;
            window.open(url);
        }
    },
    componentDidMount: function() {
        tmp = this;
        $('.type').click(function(){
            type = this.name;
            _limit = 20;
            _offset = 0;
            _continue = true;
            tmp.props.change_by_type(type, _limit, _offset);
        });
        $('.platform').click(function(){
            _limit = 20;
            _offset = 0;
            _continue = true;
            platform = this.name;
            setcookie('platform', platform);
            tmp.props.change_by_type_and_platform(getcookie('type'), platform, _limit, _offset);
        });
    },
    render: function() {
        return (
            <div id="nav">
                <ul>
                    <li id="filter_1">
                        <button className="type" name="teleplay">电视剧</button>
                        <button className="type" name="variety">综艺</button>
                        <input id="search_input" type="text" placeholder="输入剧名/综艺搜索" ref='search_input' />
                        <button className="search_button" onClick={this.search.bind(this, type='teleplay')}>搜索电视</button>
                        <button className="search_button" onClick={this.search.bind(this, type='variety')}>搜索综艺</button>
                    </li>
                    <li id="filter_2">
                        <button className='platform' name="iqy">爱奇艺</button>
                        <button className='platform' name="qq">腾讯</button>
                        <button className='platform' name="yk">优酷</button>
                        <button className='platform' name="sh">搜狐</button>
                        <button className='platform' name="let">乐视</button>
                        <button className='platform' name="mg">芒果TV</button>
                    </li>
                </ul>
            </div>
        );
    }
});

var DataAvi = React.createClass({
    pageTurn: function() {
        if (!_continue) {
            return false;
        }
        tvInfos = this.state.data;
        play_infos = {}
        type = getcookie('type')
        platform = getcookie('platform')
        _offset += _limit
        $.ajax({
            url: this.props.url + '?type=' + type + '&platform=' + platform + '&limit=' + _limit + '&offset=' + _offset,
            cache: false,
            type: 'get',
            success: function(play_infos) {
                play_infos = JSON.parse(play_infos)
                if (play_infos.length < _limit) {
                    _continue = false;
                    this.setState({flag: ""});
                }
                newtvInfos = tvInfos.concat(play_infos);
                this.setState({data: newtvInfos});
            }.bind(this),
            error: function(xhr, status,err) {
                console.log(xhr, status, err.toString());
            }
        });
    },
    change_by_type_and_platform: function(type, platform, limit, offset) {
        this.loadPlayInfo(type, platform, limit, offset);
    },
    change_by_type: function(type, limit, offset) {
        setcookie('type', type);
        setcookie('platform', 'all');
        this.loadPlayInfo(type, 'all', limit, offset);
    },
    loadPlayInfo: function(type, platform, limit, offset) {
        $.ajax({
            url: this.props.url + '?type=' + type + '&platform=' + platform + '&limit=' + limit + '&offset=' + offset,
            cache: false,
            type: 'get',
            success: function(play_infos) {
                this.setState({data: JSON.parse(play_infos)});
                this.setState({flag: "..."});
            }.bind(this),
            error: function(xhr, status,err) {
                console.log(xhr, status, err.toString());
            }
        });
    },
    getInitialState: function() {
        setcookie('type', 'teleplay');
        setcookie('platform', 'all');
        return {data: [],flag: "..."};
    },
    componentDidMount: function() {
        this.loadPlayInfo('teleplay', 'all',_limit, _offset);
    },
    render: function() {
        return (
            <div>
                <Nav change_by_type={this.change_by_type}
                     change_by_type_and_platform={this.change_by_type_and_platform}
                ></Nav>
                <AllPlayInfo data={this.state.data} pageTurn={this.pageTurn} flag={this.state.flag}></AllPlayInfo>
                <ChartInfo url={this.props.url}></ChartInfo>
            </div>
        );
    }
});

ReactDOM.render(
  <DataAvi url="./api/v1/playinfo"></DataAvi>,
  document.getElementById('dataavi')
);