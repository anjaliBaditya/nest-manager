import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.emum';
import { createTaskDto } from './dto/create-task.dto';
import { getTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getAllTask(filterDto: getTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTask(filterDto, user);
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task)
      throw new NotFoundException(`Task with id '${id}' is not found!`);

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    await this.taskRepository.delete({ id, userId: user.id });
    return task;
  }

  async patchTaskById(
    id: number,
    value: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = value;
    await task.save();
    return task;
  }
}

// stores the actuall bussiness logic
