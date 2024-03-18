import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {getFrameHtmlResponse, FrameRequest} from "@coinbase/onchainkit/frame";


export async function POST(req: NextRequest): Promise<Response> {
    const body: FrameRequest = await req.json();

    console.log("Deploying Shardeum Node from Marketplace...");

    let data = JSON.stringify({
        "organizationId": "654e13d698c56c0011bd8574",
        "uniqueTopicId": "b0c9fe22-3342-4c91-ad44-799bf686636f",
        "computeProjectId": "65f792ab9590b9001286ab08",
        "region": "us-west",
        "scalable": true,
        "services": [
            {
                "name": "registry-gitlab-com-shardeum-server",
                "image": "registry.gitlab.com/shardeum/server",
                "tag": "latest",
                "serviceCount": 1,
                "ports": [
                    {
                        "containerPort": 8080,
                        "exposedPort": 8080,
                        "endpoint": "endpoint"
                    },
                    {
                        "containerPort": 10001,
                        "exposedPort": 10001,
                        "endpoint": "endpoint"
                    },
                    {
                        "containerPort": 9001,
                        "exposedPort": 9001,
                        "endpoint": "endpoint"
                    }
                ],
                "args": [],
                "command": [
                    "sh",
                    "-c",
                    "apt-get update && apt install sudo -y && apt-get install gettext -y && cd /home/node && mkdir app && cd app && ln -s /usr/src/app /home/node/app/validator && git clone https://gitlab.com/shardeum/validator/dashboard.git && cp -r dashboard/* . && bash entrypoint.sh"
                ],
                "akashMachineImageName": "Terra Medium",
                "templateId": "6496eb9ba579a6bc8507cae7",
                "env": [
                    {
                        "value": "EXT_IP=auto",
                        "isSecret": false
                    },
                    {
                        "value": "INT_IP=auto",
                        "isSecret": false
                    },
                    {
                        "value": "EXISTING_ARCHIVERS=[{\"ip\":\"172.105.153.160\",\"port\":4000,\"publicKey\":\"7af699dd711074eb96a8d1103e32b589e511613ebb0c6a789a9e8791b2b05f34\"},{\"ip\":\"45.79.109.231\",\"port\":4000,\"publicKey\":\"2db7c949632d26b87d7e7a5a4ad41c306f63ee972655121a37c5e4f52b00a542\"},{\"ip\":\"172.233.176.64\",\"port\":4000,\"publicKey\":\"f8452228fa67578d6957392858fbbe3545ab98dbbc277e9b8b9f7a0f5177ca36\"}]",
                        "isSecret": false
                    },
                    {
                        "value": "APP_MONITOR=50.116.18.184",
                        "isSecret": false
                    },
                    {
                        "value": "DASHPORT=8080",
                        "isSecret": false
                    },
                    {
                        "value": "SERVERIP=23.158.200.193",
                        "isSecret": false
                    },
                    {
                        "value": "LOCALLANIP=23.158.200.193",
                        "isSecret": false
                    },
                    {
                        "value": "SHMEXT=9001",
                        "isSecret": false
                    },
                    {
                        "value": "SHMINT=10001",
                        "isSecret": false
                    },
                    {
                        "value": "RUNDASHBOARD=y",
                        "isSecret": false
                    },
                    {
                        "value": "DASHPASS=test123",
                        "isSecret": false
                    },
                    {
                        "value": "RPC_SERVER_URL=https://sphinx.shardeum.org",
                        "isSecret": false
                    }
                ],
                "autoscalingRules": null,
                "customServiceSpecs": {
                    "storage": "256Gi"
                }
            }
        ],
        "autoscalingRules": null
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-v2.spheron.network/v1/compute-instance/create',
        headers: {
            'authority': 'api-v2.spheron.network',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': `Bearer ${process.env.SPHERON_ACCESS_TOKEN}`,
            'content-type': 'application/json',
            'origin': 'https://app.spheron.network',
            'referer': 'https://app.spheron.network/',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Cookie': `api.sid=${process.env.COOKIE}`
        },
        data: data
    };

    let computeDeploymentIdLocal: string;
    let computeInstanceIdLocal: string;

    let response = await axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            computeDeploymentIdLocal = response.data?.computeDeploymentId;
            computeInstanceIdLocal = response.data?.computeInstanceId;

        })
        .catch((error) => {
            console.log(error);
        });

    return new NextResponse(getFrameHtmlResponse({
            ogTitle: `Deployed Shardeum instance to: ${computeInstanceIdLocal}`,
            ogDescription: "Deployed Shardeum node!",
            image:
                {
                    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABHoAAAJYCAYAAAAde4FyAAAmlklEQVR4nO3dT6xtV10H8ONUcaiCE0lQSGqixAKTknB1YElpOxAw6TOxddCStEwACyP1iSP558SSUAa2JrYGqwNeIdaBXhI7ETA4kIQGkjrh75DCVPf3PNfrYrP22fvce/v63u99Psnqu+/ds/dea+21b/L7dp1zf+b2337v/+4AAAAAuOkJegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAA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AABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFCHoAQAAAChC0AMAAABQhKAHAAAAoAhBDwAAAEARgh4AAACAIgQ9AAAAAEUIegAAAACKEPQAAAAAFPF/DxEdRfygFc0AAAAASUVORK5CYII=",
                    aspectRatio: "1.91:1"
                },
            buttons: [
                {
                    action: 'link',
                    label: `View Deployed Shardeum Node: ${computeInstanceIdLocal}`,
                    target: `https://app.spheron.network/#/compute/${computeDeploymentIdLocal}/${computeInstanceIdLocal}/overview`
                },
            ],
            state: {
                computeInstanceId: computeInstanceIdLocal,
                computeDeploymentId: computeDeploymentIdLocal,
                deployed: true
            },
        }),
    );
}