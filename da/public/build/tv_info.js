
var option = {
    title: {
        text: '视频播放今日一览',
        subtext: '4个时段，地区：全国'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        // data:['芈月传']
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    calculable: true,
    xAxis: [{
        // type : 'category',
        // boundaryGap : false,
        // data : ['00:00','8:00','12:00','22:00']
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
            formatter: '{value} 万'
        }
    }],
    series: [{
        // name:'芈月传',
        // type:'line',
        // data:[11, 11, 15, 13],
    }]
};

var ChartInfo = React.createClass({
    displayName: 'ChartInfo',

    loadPlayInfo: function () {
        search_name = this.refs.search_by_name.value;
        if (!search_name) {
            return false;
        }
        $.ajax({
            url: this.props.url + '/' + search_name,
            cache: false,
            type: 'get',
            success: function (play_infos) {
                play_infos = $.parseJSON(play_infos);
                if (play_infos.series.length) {
                    myChart = echarts.init(document.getElementById('single_chart_info'));
                    option.legend = play_infos.legend;
                    option.series = play_infos.series;
                    option.xAxis = play_infos.xAxis;
                    myChart.setOption(option);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr, status, err.toString());
            }
        });
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        myChart = echarts.init(document.getElementById('single_chart_info'));
        myChart.setOption(option);
    },
    render: function () {
        return React.createElement(
            'div',
            { id: 'single_chart' },
            React.createElement(
                'h3',
                { id: 'single_chart_info_title' },
                '剧目/综艺今日播放一览'
            ),
            React.createElement(
                'div',
                { className: 'single_and_compare' },
                React.createElement('input', { id: 'search_by_name', type: 'text', placeholder: '多个名字请用空格分隔', ref: 'search_by_name' }),
                React.createElement(
                    'a',
                    { id: 'search_by_name_button', onClick: this.loadPlayInfo },
                    '搜索'
                )
            ),
            React.createElement('div', { id: 'single_chart_info' })
        );
    }
});

var AllPlayInfo = React.createClass({
    displayName: 'AllPlayInfo',

    render: function () {
        var playInfoNodes = this.props.data.map(function (play_info) {
            return React.createElement(
                'tbody',
                { key: play_info.id },
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        play_info.name
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.time_at
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.day_play_counts
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.all_play_counts
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.avg_play
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.current_number,
                        '/',
                        play_info.all_number
                    ),
                    React.createElement(
                        'td',
                        null,
                        play_info.cast_member
                    )
                )
            );
        });
        return React.createElement(
            'div',
            { id: 'all_play_info' },
            React.createElement(
                'div',
                { id: 'gride_info' },
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                null,
                                '剧名'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '日期'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '今日播放量(万)'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '总播放量(万)'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '集均播放量(万)'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '更新_集/共_集'
                            ),
                            React.createElement(
                                'td',
                                null,
                                '主演'
                            )
                        )
                    ),
                    playInfoNodes
                )
            )
        );
    }
});

var Nav = React.createClass({
    displayName: 'Nav',

    render: function () {
        return React.createElement(
            'div',
            { id: 'nav' },
            React.createElement(
                'ul',
                null,
                React.createElement(
                    'li',
                    { id: 'filter_1' },
                    React.createElement(
                        'button',
                        { onClick: this.props.change2Teleplay },
                        '电视剧'
                    ),
                    React.createElement(
                        'button',
                        { onClick: this.props.change2Variety },
                        '综艺'
                    ),
                    React.createElement('input', { id: 'search_input', type: 'text', placeholder: '输入剧名/综艺搜索' }),
                    React.createElement(
                        'button',
                        { id: 'search_button' },
                        '搜索'
                    )
                ),
                React.createElement(
                    'li',
                    { id: 'filter_2' },
                    React.createElement(
                        'button',
                        null,
                        '爱奇艺'
                    ),
                    React.createElement(
                        'button',
                        null,
                        '腾讯'
                    ),
                    React.createElement(
                        'button',
                        null,
                        '优酷'
                    ),
                    React.createElement(
                        'button',
                        null,
                        '搜狐'
                    ),
                    React.createElement(
                        'button',
                        null,
                        '乐视'
                    ),
                    React.createElement(
                        'button',
                        null,
                        '芒果TV'
                    )
                )
            )
        );
    }
});
var DataAvi = React.createClass({
    displayName: 'DataAvi',

    change2Teleplay: function () {
        this.loadPlayInfo('teleplay');
    },
    change2Variety: function () {
        setcookie('type', 'variety');
        this.loadPlayInfo('variety');
    },
    loadPlayInfo: function (type) {
        $.ajax({
            url: this.props.url + '?type=' + type,
            cache: false,
            type: 'get',
            success: function (play_infos) {
                this.setState({ data: JSON.parse(play_infos) });
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(xhr, status, err.toString());
            }
        });
    },
    getInitialState: function () {
        setcookie('type', 'teleplay');
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadPlayInfo('teleplay');
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(Nav, { change2Variety: this.change2Variety, change2Teleplay: this.change2Teleplay }),
            React.createElement(AllPlayInfo, { data: this.state.data }),
            React.createElement(ChartInfo, { url: this.props.url })
        );
    }
});

ReactDOM.render(React.createElement(DataAvi, { url: 'http://dataavi.cg.com/api/v1/playinfo' }), document.getElementById('dataavi'));