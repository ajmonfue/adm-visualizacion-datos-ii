import matplotlib.pyplot as plt


class Chart:
    def __init__(self, x_axis, y_axis, x_axis_name, y_axis_name):
        self.x_axis = x_axis
        self.y_axis = y_axis
        self.x_axis_name = x_axis_name
        self.y_axis_name = y_axis_name

    def generate_chart(self, chart_name):
        chart = plt.figure()

        axes = chart.add_axes([0.15, 0.15, 0.75, 0.75])
        axes.set_title(chart_name)
        axes.set_xlabel(self.x_axis_name)
        axes.set_ylabel(self.y_axis_name)

        self.set_type_chart(axes)

        return chart

    def set_type_chart(self, axes):
        pass


class LineChart(Chart):
    def set_type_chart(self, axes):
        axes.plot(self.x_axis, self.y_axis)


class BarChart(Chart):
    def set_type_chart(self, axes):
        axes.bar(self.x_axis, self.y_axis)


class PointChart(Chart):
    def set_type_chart(self, axes):
        axes.scatter(self.x_axis, self.y_axis)