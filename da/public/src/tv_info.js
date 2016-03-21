
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
                <tbody key={play_info.id}>
                    <tr>
                        <td><a href={"./two.html?name=" + play_info.name + "&type=" +play_info.type}
                               target="_blank">{play_info.name}</a></td>
                        <td>{play_info.time_at}</td>
                        <td>{play_info.day_play_counts}</td>
                        <td>{play_info.all_play_counts}</td>
                        <td>{play_info.avg_play}</td>
                        <td>{play_info.current_number}/{play_info.all_number}</td>
                        <td>{play_info.cast_member}</td>
                    </tr>
                </tbody>
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
                        {playInfoNodes}
                    </table>
                </div>
            </div>
        );
    }
});

var Nav = React.createClass({
    componentDidMount: function() {
        tmp = this;
        $('.type').click(function(){
            type = this.name;
            tmp.props.change_by_type(type);
        });
        $('.platform').click(function(){
            platform = this.name;
            tmp.props.change_by_type_and_platform(getcookie('type'), platform);
        });
    },
    render: function() {
        return (
            <div id="nav">
                <ul>
                    <li id="filter_1">
                        <button className="type" name="teleplay">电视剧</button>
                        <button className="type" name="variety">综艺</button>
                        <input id="search_input" type="text" placeholder="输入剧名/综艺搜索"  />
                        <button id="search_button">搜索</button>
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
    change_by_type_and_platform:function(type, platform){
        this.loadPlayInfo(type, platform);
    },
    change_by_type:function(type){
        setcookie('type', type);
        this.loadPlayInfo(type, 'all');
    },
    loadPlayInfo: function(type, platform) {
        $.ajax({
            url: this.props.url + '?type=' + type + '&platform=' + platform,
            cache: false,
            type: 'get',
            success: function(play_infos) {
                this.setState({data: JSON.parse(play_infos)});
            }.bind(this),
            error: function(xhr, status,err) {
                console.log(xhr, status, err.toString());
            }
        });
    },
    getInitialState: function() {
        setcookie('type', 'teleplay');
        return {data: []};
    },
    componentDidMount: function() {
        setcookie('type', 'teleplay');
        this.loadPlayInfo('teleplay', 'all');
    },
    render: function() {
        return (
            <div>
                <Nav change_by_type={this.change_by_type}
                     change_by_type_and_platform={this.change_by_type_and_platform}
                ></Nav>
                <AllPlayInfo data={this.state.data}></AllPlayInfo>
                <ChartInfo url={this.props.url}></ChartInfo>
            </div>
        );
    }
});

ReactDOM.render(
  <DataAvi url="./api/v1/playinfo"></DataAvi>,
  document.getElementById('dataavi')
);