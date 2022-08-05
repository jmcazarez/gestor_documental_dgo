// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
    production: false,
    hmr: false,
    apiCms: 'http://localhost:3600/',
    apiStrapi: 'http://138.185.2.214:9000/',
    apiStrapiMin: 'http://138.185.2.214:9000',
    imageBase64:
        "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",
    widgets: {
        widget1: {
            chartType: "line",
            datasets: {
                "2016": [
                    {
                        label: "Sales",
                        data: [
                            1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2,
                            2.9,
                        ],
                        fill: "start",
                    },
                ],
                "2017": [
                    {
                        label: "Sales",
                        data: [
                            2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1,
                            3.8,
                        ],
                        fill: "start",
                    },
                ],
                "2018": [
                    {
                        label: "Sales",
                        data: [
                            3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2,
                            2.9,
                        ],
                        fill: "start",
                    },
                ],
            },
            labels: [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
            ],
            colors: [
                {
                    borderColor: "#42a5f5",
                    backgroundColor: "#42a5f5",
                    pointBackgroundColor: "#1e88e5",
                    pointHoverBackgroundColor: "#1e88e5",
                    pointBorderColor: "#ffffff",
                    pointHoverBorderColor: "#ffffff",
                },
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 32,
                        left: 32,
                        right: 32,
                    },
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2,
                    },
                    line: {
                        tension: 0,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                                drawBorder: false,
                                tickMarkLength: 18,
                            },
                            ticks: {
                                fontColor: "#ffffff",
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 1.5,
                                max: 5,
                                stepSize: 0.5,
                            },
                        },
                    ],
                },
                plugins: {
                    filler: {
                        propagate: false,
                    },
                    xLabelsOnTop: {
                        active: true,
                    },
                },
            },
        },
        widget2: {
            conversion: {
                value: 492,
                ofTarget: 13,
            },
            chartType: "bar",
            datasets: [
                {
                    label: "Conversion",
                    data: [221, 428, 492, 471, 413, 344, 294],
                },
            ],
            labels: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            colors: [
                {
                    borderColor: "#42a5f5",
                    backgroundColor: "#42a5f5",
                },
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            display: false,
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 100,
                                max: 500,
                            },
                        },
                    ],
                },
            },
        },
        widget3: {
            impressions: {
                value: "87k",
                ofTarget: 12,
            },
            chartType: "line",
            datasets: [
                {
                    label: "Impression",
                    data: [
                        67000, 54000, 82000, 57000, 72000, 57000, 87000, 72000,
                        89000, 98700, 112000, 136000, 110000, 149000, 98000,
                    ],
                    fill: false,
                },
            ],
            labels: [
                "Jan 1",
                "Jan 2",
                "Jan 3",
                "Jan 4",
                "Jan 5",
                "Jan 6",
                "Jan 7",
                "Jan 8",
                "Jan 9",
                "Jan 10",
                "Jan 11",
                "Jan 12",
                "Jan 13",
                "Jan 14",
                "Jan 15",
            ],
            colors: [
                {
                    borderColor: "#5c84f1",
                },
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 2,
                        borderWidth: 1,
                        hoverRadius: 2,
                        hoverBorderWidth: 1,
                    },
                    line: {
                        tension: 0,
                    },
                },
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            display: false,
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                // min: 100,
                                // max: 500
                            },
                        },
                    ],
                },
            },
        },
        widget4: {
            visits: {
                value: 882,
                ofTarget: -9,
            },
            chartType: "bar",
            datasets: [
                {
                    label: "Visits",
                    data: [432, 428, 327, 363, 456, 267, 231],
                },
            ],
            labels: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            colors: [
                {
                    borderColor: "#f44336",
                    backgroundColor: "#f44336",
                },
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            display: false,
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 150,
                                max: 500,
                            },
                        },
                    ],
                },
            },
        },
        widget5: {
            chartType: "line",
            datasets: {
                yesterday: [
                    {
                        label: "Documentos",
                        data: [
                            2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900,
                            3000, 3400, 4100, 3800, 2200, 2900, 3900, 2500,
                            3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800,
                        ],
                        fill: "start",
                    },
                ],
                today: [
                    {
                        label: "Documentos",
                        data: [
                            3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900,
                            2900, 3900, 2500, 3800, 2200, 2900, 3900, 2500,
                            3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800,
                        ],
                        fill: "start",
                    },
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: [
                "12am",
                "1am",
                "2am",
                "3am",
                "4am",
                "5am",
                "6am",
                "7am",
                "8am",
                "9am",
                "10am",
                "11am",
                "12pm",
                "1pm",
                "2pm",
                "3pm",
                "4pm",
                "5pm",
                "6pm",
                "7pm",
                "8pm",
                "9pm",
                "10pm",
                "11pm",
            ],
            colors: [
                {
                    borderColor: "rgba(244, 67, 54, 0.87)",
                    backgroundColor: "transparent",
                    pointBackgroundColor: "rgba(244, 67, 54, 0.87)",
                    pointHoverBackgroundColor: "rgba(244, 67, 54, 0.87)",
                    pointBorderColor: "#ffffff",
                    pointHoverBorderColor: "#ffffff",
                },
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false,
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: "nearest",
                    mode: "index",
                    intersect: false,
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32,
                    },
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                fontColor: "rgba(0,0,0,0.54)",
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16,
                            },
                            ticks: {
                                stepSize: 1000,
                            },
                        },
                    ],
                },
                plugins: {
                    filler: {
                        propagate: false,
                    },
                },
            },
        },
        widget6: {
            markers: [
                {
                    lat: 52,
                    lng: -73,
                    label: "120",
                },
                {
                    lat: 37,
                    lng: -104,
                    label: "498",
                },
                {
                    lat: 21,
                    lng: -7,
                    label: "443",
                },
                {
                    lat: 55,
                    lng: 75,
                    label: "332",
                },
                {
                    lat: 51,
                    lng: 7,
                    label: "50",
                },
                {
                    lat: 31,
                    lng: 12,
                    label: "221",
                },
                {
                    lat: 45,
                    lng: 44,
                    label: "455",
                },
                {
                    lat: -26,
                    lng: 134,
                    label: "231",
                },
                {
                    lat: -9,
                    lng: -60,
                    label: "67",
                },
                {
                    lat: 33,
                    lng: 104,
                    label: "665",
                },
            ],
            styles: [
                {
                    featureType: "administrative",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#444444",
                        },
                    ],
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [
                        {
                            color: "#f2f2f2",
                        },
                    ],
                },
                {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [
                        {
                            visibility: "off",
                        },
                    ],
                },
                {
                    featureType: "road",
                    elementType: "all",
                    stylers: [
                        {
                            saturation: -100,
                        },
                        {
                            lightness: 45,
                        },
                    ],
                },
                {
                    featureType: "road.highway",
                    elementType: "all",
                    stylers: [
                        {
                            visibility: "simplified",
                        },
                    ],
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.icon",
                    stylers: [
                        {
                            visibility: "off",
                        },
                    ],
                },
                {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [
                        {
                            visibility: "off",
                        },
                    ],
                },
                {
                    featureType: "water",
                    elementType: "all",
                    stylers: [
                        {
                            color: "#039be5",
                        },
                        {
                            visibility: "on",
                        },
                    ],
                },
            ],
        },
        widget7: {
            scheme: {
                domain: ["#4867d2", "#5c84f1", "#89a9f4"],
            },
            devices: [
                {
                    name: "Desktop",
                    value: 92.8,
                    change: -0.6,
                },
                {
                    name: "Mobile",
                    value: 6.1,
                    change: 0.7,
                },
                {
                    name: "Tablet",
                    value: 1.1,
                    change: 0.1,
                },
            ],
        },
        widget8: {
            scheme: {
                domain: ["#5c84f1"],
            },
            today: "12,540",
            change: {
                value: 321,
                percentage: 2.05,
            },
            data: [
                {
                    name: "Sales",
                    series: [
                        {
                            name: "Jan 1",
                            value: 540,
                        },
                        {
                            name: "Jan 2",
                            value: 539,
                        },
                        {
                            name: "Jan 3",
                            value: 538,
                        },
                        {
                            name: "Jan 4",
                            value: 539,
                        },
                        {
                            name: "Jan 5",
                            value: 540,
                        },
                        {
                            name: "Jan 6",
                            value: 539,
                        },
                        {
                            name: "Jan 7",
                            value: 540,
                        },
                    ],
                },
            ],
            dataMin: 538,
            dataMax: 541,
        },
        widget9: {
            rows: [
                {
                    title: "Holiday Travel",
                    clicks: 3621,
                    conversion: 90,
                },
                {
                    title: "Get Away Deals",
                    clicks: 703,
                    conversion: 7,
                },
                {
                    title: "Airfare",
                    clicks: 532,
                    conversion: 0,
                },
                {
                    title: "Vacation",
                    clicks: 201,
                    conversion: 8,
                },
                {
                    title: "Hotels",
                    clicks: 94,
                    conversion: 4,
                },
            ],
        },
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
