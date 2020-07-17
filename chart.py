import matplotlib.pyplot as plt


class Chart:
    def __init__(self, x_axis, y_axis, x_axis_name, y_axis_name):
        self.x_axis = x_axis
        self.y_axis = y_axis
        self.x_axis_name = x_axis_name
        self.y_axis_name = y_axis_name


class LineChart(Chart):
    def render(self, chart_name, filename):
        chart = plt.figure()
        chart.suptitle(chart_name)
        plt.plot(self.x_axis, self.y_axis)

        plt.xlabel(self.x_axis_name)
        plt.ylabel(self.y_axis_name)

        plt.savefig(filename)
