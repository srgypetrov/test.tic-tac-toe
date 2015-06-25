from django.conf.urls import patterns, url

from .views import (UserListView, GameDetailView, CreateMoveView,
                    accept_invite, decline_invite, replay)


urlpatterns = patterns(
    '',
    url(r'^$', UserListView.as_view(), name='game_user_list'),
    url(r'^game/(?P<pk>\d+)/$', GameDetailView.as_view(), name='game_detail'),
    url(r'^game/(?P<pk>\d+)/replay$', replay, name='game_replay'),
    url(r'^game/create_move/$', CreateMoveView.as_view(), name='game_create_move'),
    url(r'^invite/(?P<invite_pk>\d+)/$', accept_invite, name='accept_invite'),
    url(r'^invite/(?P<invite_pk>\d+)/decline$', decline_invite, name='decline_invite'),
)
