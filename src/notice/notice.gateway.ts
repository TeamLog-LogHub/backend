import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@WebSocketGateway()
export class NoticeGateway {
  constructor(private readonly noticeService: NoticeService) {}

  @SubscribeMessage('createNotice')
  create(@MessageBody() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto);
  }

  @SubscribeMessage('findAllNotice')
  findAll() {
    return this.noticeService.findAll();
  }

  @SubscribeMessage('findOneNotice')
  findOne(@MessageBody() id: number) {
    return this.noticeService.findOne(id);
  }

  @SubscribeMessage('updateNotice')
  update(@MessageBody() updateNoticeDto: UpdateNoticeDto) {
    return this.noticeService.update(updateNoticeDto.id, updateNoticeDto);
  }

  @SubscribeMessage('removeNotice')
  remove(@MessageBody() id: number) {
    return this.noticeService.remove(id);
  }
}
