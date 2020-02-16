import 'reflect-metadata';
import { HttpController, HttpGet, HttpPut, HttpPost, HttpPatch, HttpDelete, HttpHead, HttpOptions, Authenticate, Authorize, GetRoutes, Cache, Validate } from '../../src/web/Route.Functions';

@HttpController({
    prefix: 'prefix',
    authenticationStrategy: {
        AllowAnnonymous: false
    },
    authorizationStrategy: {
        RoleStrategy: 'ANY'
    },
    cacheStrategy: {
        IsCacheable: false,
        GetKey: jest.fn()
    }
})
class TestControllerOne {

    @HttpGet('/one')
    public async get(): Promise<void> {

    }

    @Validate({})
    @HttpPut('/one')
    public async put(): Promise<void> {

    }

    @HttpPost('/one')
    public async post(): Promise<void> {

    }

    @HttpPatch('/one')
    public async patch(): Promise<void> {

    }

    @HttpDelete('/one')
    public async delete(): Promise<void> {

    }

    @HttpHead('/one')
    public async head(): Promise<void> {

    }

    @HttpOptions('one')
    public async options(): Promise<void> {

    }
}

@HttpController()
class TestControllerTwo {

    @Authenticate({AllowAnnonymous: true})
    @Cache()
    @HttpGet('/two')
    public async get(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @Validate({})
    @HttpPut('/two')
    public async put(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @HttpPost('/two')
    public async post(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @HttpPatch('/two')
    public async patch(): Promise<void> {

    }

    @Authenticate({AllowAnnonymous: false})
    @Authorize(['Admin'], {RoleStrategy: 'ALL'})
    @HttpDelete('/two')
    public async delete(): Promise<void> {

    }

    @HttpHead('//two')
    public async head(): Promise<void> {

    }

    @HttpOptions('two')
    public async options(): Promise<void> {

    }
}


@HttpController({
    prefix: '/other'
})
class TestControllerThree {

    @Authenticate({AllowAnnonymous: true})
    @Cache()
    @HttpGet('/three')
    public async get(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @Validate({})
    @HttpPut('/three')
    public async put(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @HttpPost('/three')
    public async post(): Promise<void> {

    }

    @Authenticate()
    @Authorize(['Admin'])
    @HttpPatch('/three')
    public async patch(): Promise<void> {

    }

    @Authenticate({AllowAnnonymous: false})
    @Authorize(['Admin'], {RoleStrategy: 'ALL'})
    @HttpDelete('/three')
    public async delete(): Promise<void> {

    }

    @HttpHead('/three')
    public async head(): Promise<void> {

    }

    @HttpOptions('three')
    public async options(): Promise<void> {

    }
}

describe('Route Functions', () => {
    it('Should exist', () => {
        expect(TestControllerOne).toBeDefined();
        expect(TestControllerTwo).toBeDefined();
        expect(TestControllerThree).toBeDefined();
    });

    it('Should get all the routes', () => {
        const routes = GetRoutes({
            authentication: {AllowAnnonymous: false},
            authorization: {RoleStrategy: 'ANY'},
            cache: {IsCacheable: false, GetKey: () => ''}
        });

        expect(routes).toHaveLength(21);
        routes.forEach(route => {
            if(route.path.includes('prefix')) {
                expect(route.path).toBe('/prefix/one');
            } else if(route.path.includes('other')) {
                expect(route.path).toBe('/other/three');
            } else {
                expect(route.path).toBe('/two');
            }
            if(route.method === 'PUT') {
                expect(route.validator).toBeDefined();
            }

            expect(route.method.toLowerCase()).toBe(route.action);
        })
    })
})