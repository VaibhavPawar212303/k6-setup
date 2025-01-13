export const options = {
    //spike testing
    stages: [
        { duration: '1m', target: 1 },
        { duration: '1m', target: 1 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<4000'],
    }
};
