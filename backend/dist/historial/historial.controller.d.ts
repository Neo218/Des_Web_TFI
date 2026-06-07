import { HistorialService } from './historial.service';
export declare class HistorialController {
    private readonly historialService;
    constructor(historialService: HistorialService);
    findAll(): Promise<import("./entities/historial-cambio.entity").HistorialCambio[]>;
}
