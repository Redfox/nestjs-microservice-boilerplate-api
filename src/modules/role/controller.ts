import { Controller, Delete, Get, HttpCode, Post, Put, Req, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleAddPermissionInput, RoleAddPermissionOutput } from '@/core/role/use-cases/role-add-permission';
import { RoleCreateInput, RoleCreateOutput } from '@/core/role/use-cases/role-create';
import { RoleDeleteInput, RoleDeleteOutput } from '@/core/role/use-cases/role-delete';
import { RoleGetByIdInput, RoleGetByIdOutput } from '@/core/role/use-cases/role-get-by-id';
import { RoleListInput, RoleListOutput } from '@/core/role/use-cases/role-list';
import { RoleUpdateInput, RoleUpdateOutput } from '@/core/role/use-cases/role-update';
import { Permission } from '@/utils/decorators';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import {
  IRoleAddPermissionAdapter,
  IRoleCreateAdapter,
  IRoleDeleteAdapter,
  IRoleDeletePermissionAdapter,
  IRoleGetByIdAdapter,
  IRoleListAdapter,
  IRoleUpdateAdapter
} from './adapter';
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly createUsecase: IRoleCreateAdapter,
    private readonly updateUsecase: IRoleUpdateAdapter,
    private readonly getByIdUsecase: IRoleGetByIdAdapter,
    private readonly listUsecase: IRoleListAdapter,
    private readonly deleteUsecase: IRoleDeleteAdapter,
    private readonly addPermissionUsecase: IRoleAddPermissionAdapter,
    private readonly deletePermissionUsecase: IRoleDeletePermissionAdapter
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  @Permission('role:create')
  async create(@Req() { body }: ApiRequest<RoleCreateInput>): Promise<RoleCreateOutput> {
    return await this.createUsecase.execute(body);
  }

  @Put(':id')
  @ApiResponse(SwaggerResponse.update[200])
  @ApiResponse(SwaggerResponse.update[404])
  @ApiBody(SwaggerRequest.update)
  @ApiParam({ name: 'id', required: true })
  @Version('1')
  @Permission('role:update')
  async update(@Req() { body, params }: ApiRequest<RoleUpdateInput>): Promise<RoleUpdateOutput> {
    return await this.updateUsecase.execute({ ...body, id: params.id });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.getById[200])
  @ApiResponse(SwaggerResponse.getById[404])
  @Version('1')
  @Permission('role:getbyid')
  async getById(@Req() { params }: ApiRequest<RoleGetByIdInput>): Promise<RoleGetByIdOutput> {
    return await this.getByIdUsecase.execute(params);
  }

  @Get()
  @ApiQuery(SwaggerRequest.list.pagination.limit)
  @ApiQuery(SwaggerRequest.list.pagination.page)
  @ApiQuery(SwaggerRequest.list.sort)
  @ApiQuery(SwaggerRequest.list.search)
  @ApiResponse(SwaggerResponse.list[200])
  @Version('1')
  @Permission('role:list')
  async list(@Req() { query }: ApiRequest<RoleListInput>): Promise<RoleListOutput> {
    const input: RoleListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.listUsecase.execute(input);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[404])
  @Version('1')
  @Permission('role:delete')
  async delete(@Req() { params }: ApiRequest<RoleDeleteInput>): Promise<RoleDeleteOutput> {
    return await this.deleteUsecase.execute(params);
  }

  @Put('/add-permissions/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiBody(SwaggerRequest.addPermission)
  @ApiResponse(SwaggerResponse.addPermissions[200])
  @ApiResponse(SwaggerResponse.addPermissions[404])
  @Version('1')
  @Permission('role:addpermission')
  async addPermissions(@Req() { body, params }: ApiRequest<RoleAddPermissionInput>): Promise<RoleAddPermissionOutput> {
    return await this.addPermissionUsecase.execute({ ...body, id: params.id });
  }

  @Put('/remove-permissions/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiBody(SwaggerRequest.deletePermission)
  @ApiResponse(SwaggerResponse.removePermissions[200])
  @ApiResponse(SwaggerResponse.removePermissions[404])
  @HttpCode(200)
  @Version('1')
  @Permission('role:deletepermission')
  async removePermissions(
    @Req() { body, params }: ApiRequest<RoleAddPermissionInput>
  ): Promise<RoleAddPermissionOutput> {
    return await this.deletePermissionUsecase.execute({ ...body, id: params.id });
  }
}
