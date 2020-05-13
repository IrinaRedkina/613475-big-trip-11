import FilterComponent from '../components/filter';
import {FilterType} from '../const';
import {render, RenderPosition} from "../utils/render.js";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType
      };
    });

    this._filterComponent = new FilterComponent(filters);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
