import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {getTypeGroup} from '../utils/common';
import {TypeGroup} from '../const';

const OptionSetting = {
  BAR_HEIGHT: 45,
  TITLE_FONT_SIZE: 23,
  FONT_SIZE: 13,
  PADDING: 5,
  BAR_THICKNESS: 44,
  BAR_LENGTH: 100,
};

const ChartTitle = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`
};

const getTimeDiff = (dateStart, dateEnd) => {
  return moment(dateEnd).diff(dateStart);
};

const getHours = (mlSeconds) => {
  const duration = moment.duration(mlSeconds);

  return duration.days() * 24 + duration.hours();
};

const toUpperCaseItems = (array) => {
  return array.map((item) => item.toUpperCase());
};

const getPriceForTypes = (events) => {
  const typePrice = events.map((event) => {
    return {
      type: event.type,
      price: Number(event.price)
    };
  });

  return typePrice.reduce((acc, event) => {
    const {type, price} = event;
    acc[type] = price + (acc[type] || 0);

    return acc;
  }, {});
};

const getCountForTransports = (events) => {
  const transports = events
    .filter((event) => getTypeGroup(event.type) === TypeGroup.TRANSFER)
    .map((event) => event.type);

  return transports.reduce((acc, transport) => {
    acc[transport] = (acc[transport] || 0) + 1;
    return acc;
  }, {});
};

const getTimeForTypes = (events) => {
  const typeTime = events.map((event) => {
    return {
      type: event.type,
      time: getTimeDiff(event.dueDateStart, event.dueDateEnd),
    };
  });

  return typeTime.reduce((acc, event) => {
    const {type, time} = event;
    acc[type] = time + (acc[type] || 0);

    return acc;
  }, {});
};

const createChart = (ctx, labels, data, title, titleFormat) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: toUpperCaseItems(labels),
      datasets: getDataset(data)
    },
    options: getOptions(title, titleFormat)
  });
};

const getOptions = (titleText, formatter) => {
  return {
    plugins: {
      datalabels: {
        font: {
          size: OptionSetting.FONT_SIZE
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter
      }
    },
    title: {
      display: true,
      text: titleText,
      fontColor: `#000000`,
      fontSize: OptionSetting.TITLE_FONT_SIZE,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: OptionSetting.FONT_SIZE,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: OptionSetting.BAR_THICKNESS,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: OptionSetting.BAR_LENGTH
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    }
  };
};

const getDataset = (data) => {
  return [{
    data,
    backgroundColor: `#ffffff`,
    hoverBackgroundColor: `#ffffff`,
    anchor: `start`
  }];
};

const renderMoneyChart = (moneyCtx, events) => {
  const labels = Object.keys(getPriceForTypes(events));
  const data = Object.values(getPriceForTypes(events));

  moneyCtx.height = OptionSetting.BAR_HEIGHT * labels.length;

  createChart(moneyCtx, labels, data, ChartTitle.MONEY, (val) => `€ ${val}`);
};

const renderTransportChart = (transportCtx, events) => {
  const labels = Object.keys(getCountForTransports(events));
  const data = Object.values(getCountForTransports(events));

  transportCtx.height = OptionSetting.BAR_HEIGHT * labels.length;

  createChart(transportCtx, labels, data, ChartTitle.TRANSPORT, (val) => `${val}x`);
};

const renderTimeChart = (timeSpendCtx, events) => {
  const labels = Object.keys(getTimeForTypes(events));
  const data = Object.values(getTimeForTypes(events));
  const hours = data.map((mlSeconds) => getHours(mlSeconds));

  timeSpendCtx.height = OptionSetting.BAR_HEIGHT * labels.length;

  createChart(timeSpendCtx, labels, hours, ChartTitle.TIME, (val) => `${val}H`);
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._events = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;

    super.rerender();

    this._renderCharts();
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }

  _renderCharts() {
    const element = this.getElement();
    const events = this._events.getEventsAll();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, events);
    this._transportChart = renderTransportChart(transportCtx, events);
    this._timeSpendChart = renderTimeChart(timeSpendCtx, events);
  }
}
