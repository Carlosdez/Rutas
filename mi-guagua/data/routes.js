[
    {
        "id": "r1",
        "name": "Ruta Centro",
        "segments": [
            {"from": "gz", "to": "vs", "transport": "concho", "time_min": 15, "cost": 50},
            {"from": "vs", "to": "cm", "transport": "guagua", "time_min": 20, "cost": 25}
        ]
    },
    {
        "id": "r2",
        "name": "Ruta Express",
        "segments": [
            {"from": "gz", "to": "nc", "transport": "motoconcho", "time_min": 10, "cost": 80},
            {"from": "nc", "to": "pl", "transport": "concho", "time_min": 12, "cost": 60},
            {"from": "pl", "to": "cm", "transport": "carro-publico", "time_min": 18, "cost": 40}
        ]
    },
    {
        "id": "r3",
        "name": "Ruta Colonial", 
        "segments": [
            {"from": "zm", "to": "gz", "transport": "guagua", "time_min": 8, "cost": 30},
            {"from": "gz", "to": "cc", "transport": "concho", "time_min": 5, "cost": 45},
            {"from": "cc", "to": "cm", "transport": "guagua", "time_min": 15, "cost": 25}
        ]
    },
    {
        "id": "r4",
        "name": "Ruta Norte",
        "segments": [
            {"from": "nc", "to": "pl", "transport": "concho", "time_min": 12, "cost": 60},
            {"from": "pl", "to": "el", "transport": "motoconcho", "time_min": 8, "cost": 70},
            {"from": "el", "to": "cm", "transport": "carro-publico", "time_min": 10, "cost": 35}
        ]
    },
    {
        "id": "r5",
        "name": "Ruta Directa",
        "segments": [
            {"from": "gz", "to": "cm", "transport": "motoconcho", "time_min": 25, "cost": 120}
        ]
    },
    {
        "id": "r6",
        "name": "Ruta Sur",
        "segments": [
            {"from": "zm", "to": "vs", "transport": "guagua", "time_min": 12, "cost": 20},
            {"from": "vs", "to": "cc", "transport": "concho", "time_min": 7, "cost": 40},
            {"from": "cc", "to": "el", "transport": "motoconcho", "time_min": 10, "cost": 65},
            {"from": "el", "to": "cm", "transport": "carro-publico", "time_min": 8, "cost": 30}
        ]
    }
]