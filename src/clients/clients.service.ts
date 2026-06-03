@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private repository: Repository<Client>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  create(data: Partial<Client>) {
    return this.repository.save(data);
  }

  update(id: number, data: Partial<Client>) {
    return this.repository.update(id, data);
  }
}