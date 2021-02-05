import { Body, Get, JsonController, Post, Req, Res, UseBefore } from "routing-controllers";
import {
  AuthenticationRequestFailureException,
    Context,
  JoiValidationError,
} from "../models";
import { IAuthRequest, IAuthResponse } from "../interfaces";
import { AuthRequestSchema } from "../schemas";
import { UserAuthenticationService } from "../services";
import { AuthMiddleware } from "../middleware";

@JsonController("/auth")
class AuthController {
  constructor(private userAuthenticationService: UserAuthenticationService) {}

  @Get('/')
  @UseBefore(AuthMiddleware)
  public async get(@Req() req: any) {
    return Context.get(req).user;
  }

  @Post("/")
  public async create(
    @Body() authRequest: IAuthRequest,
    @Res() res: any
  ): Promise<IAuthResponse> {
    const { error } = AuthRequestSchema.validate(authRequest);
    if (error !== undefined) throw new JoiValidationError(error);
    try {
      const user = await this.userAuthenticationService.authenticateUser(
        authRequest.email,
        authRequest.password
      );
      const token = await this.userAuthenticationService.generateAuthToken(
        user.Id,
        user.email,
      );
      res.setHeader('x-access-token', token);
      console.log(user);
      return {
          id: user.Id
      };
    } catch (ex) {
      throw new AuthenticationRequestFailureException(ex);
    }
  }
}

export default AuthController;