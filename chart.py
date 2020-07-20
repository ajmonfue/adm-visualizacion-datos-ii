import matplotlib.pyplot as plt


class Chart:
    def __init__(self, x_axis, y_axis, x_axis_name, y_axis_name):
        self.x_axis = x_axis
        self.y_axis = y_axis
        self.x_axis_name = x_axis_name
        self.y_axis_name = y_axis_name

    def generate_chart(self, chart_name):
        figure_width = len(self.x_axis) * 0.15
        if figure_width < 5:
            figure_width = 5

        chart = plt.figure(figsize=(figure_width, 5))

        # Ancho adaptable al contenido -> https://stackoverflow.com/a/54756766
        axes_left = 1 / figure_width
        axes = chart.add_axes([axes_left, 0.15, 0.98 - axes_left, 0.75])
        axes.set_title(chart_name)
        axes.set_xlabel(self.x_axis_name)
        axes.set_ylabel(self.y_axis_name)
        axes.grid()
        axes.tick_params(axis='x', which='major', labelsize=8.5)
        axes.tick_params(axis='x', labelrotation=90)
        axes.margins(x=(1 / len(self.x_axis)))

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